import { getTasks, getTaskById, createTask, updateTask, deleteTask } from './db.js';
import { pubsub, TASK_EVENTS } from './lib/pubsub.js';
export const resolvers = {
    Query: {
        tasks: async (_parent, args) => {
            return getTasks(args.status, args.sortBy, args.limit, args.offset);
        },
        task: async (_parent, { id }) => {
            return getTaskById(id);
        },
    },
    Mutation: {
        addTask: async (_parent, { title }) => {
            return createTask(title);
        },
        updateTask: async (_parent, { id, status }) => {
            return updateTask(id, status);
        },
        deleteTask: async (_parent, { id }) => {
            return deleteTask(id);
        },
    },
    Subscription: {
        taskAdded: {
            subscribe: () => pubsub.asyncIterator([TASK_EVENTS.TASK_ADDED]),
        },
        taskUpdated: {
            subscribe: () => pubsub.asyncIterator([TASK_EVENTS.TASK_UPDATED]),
        },
        taskDeleted: {
            subscribe: () => pubsub.asyncIterator([TASK_EVENTS.TASK_DELETED]),
        },
    },
};
