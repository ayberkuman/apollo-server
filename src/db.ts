import { Prisma, status_enum as TaskStatus, Tasks as Task } from "./generated/prisma/index.js";
import { PrismaClient } from "@prisma/client";
import { pubsub, TASK_EVENTS } from "./lib/pubsub.js";



const prisma = new PrismaClient();

export async function getTasks(
  status?: TaskStatus,
  sortBy?: string,
  limit?: number,
  offset?: number
) {
  const where: Prisma.TasksWhereInput = {};

  if (status) {
    where.status = status;
  }

  const orderBy: Prisma.TasksOrderByWithRelationInput = {};
  if (sortBy) {
    switch (sortBy.toLowerCase()) {
      case "title":
        orderBy.title = "asc";
        break;
      default:
        orderBy.created_at = "desc";
    }
  } else {
    orderBy.created_at = "desc";
  }

  const totalCount = await prisma.tasks.count({ where });

  const takeLimit = limit || 10;
  const skipOffset = offset || 0;

  const tasks = await prisma.tasks.findMany({
    where,
    orderBy,
    take: takeLimit,
    skip: skipOffset,
  });

  const hasMore = skipOffset + takeLimit < totalCount;

  return {
    tasks,
    totalCount,
    hasMore,
  };
}

export async function getTaskById(id: string) {
  return await prisma.tasks.findUnique({
    where: { id },
  });
}

export async function createTask(title: string) {
  if (!title || title.trim().length === 0) {
    throw new Error("Task title cannot be empty");
  }

  if (title.length > 255) {
    throw new Error("Task title cannot exceed 255 characters");
  }

  const existingTask = await prisma.tasks.findFirst({
    where: {
      title: {
        equals: title.trim(),
        mode: "insensitive",
      },
    },
  });

  if (existingTask) {
    throw new Error(`Task with title "${title}" already exists`);
  }

  const task = await prisma.tasks.create({
    data: {
      title: title.trim(),
      status: "PENDING",
    },
  });

  pubsub.publish(TASK_EVENTS.TASK_ADDED, { taskAdded: task });

  return task;
}

export async function updateTask(id: string, status: TaskStatus) {
  const existingTask = await getTaskById(id);
  if (!existingTask) {
    throw new Error(`Task with id ${id} not found`);
  }

  if (existingTask.status === status) {
    return existingTask;
  }

  if (
    existingTask.status === "DONE" &&
    status === "PENDING"
  ) {
    throw new Error("Cannot change completed task back to pending status");
  }

  const task = await prisma.tasks.update({
    where: { id },
    data: { status },
  });

  pubsub.publish(TASK_EVENTS.TASK_UPDATED, { taskUpdated: task });

  return task;
}

export async function deleteTask(id: string) {
  const existingTask = await getTaskById(id);

  if (!existingTask) {
    throw new Error(`Task with id ${id} not found`);
  }

  await prisma.tasks.delete({
    where: { id },
  });

  pubsub.publish(TASK_EVENTS.TASK_DELETED, { taskDeleted: id });

  return id;
}
