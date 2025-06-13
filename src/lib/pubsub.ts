import { PubSub } from 'graphql-subscriptions';

export const TASK_EVENTS = {
  TASK_ADDED: "TASK_ADDED",
  TASK_UPDATED: "TASK_UPDATED",
  TASK_DELETED: "TASK_DELETED",
};


export const pubsub = new PubSub();