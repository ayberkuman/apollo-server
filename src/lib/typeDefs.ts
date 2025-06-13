export const typeDefs = `#graphql

  type Task {
  id: ID!
  title: String!
  status: String! # "PENDING" | "IN_PROGRESS" | "DONE"
}

type TasksResult {
  tasks: [Task!]!
  totalCount: Int!
  hasMore: Boolean!
}

type Query {
  tasks(status: String, sortBy: String, limit: Int, offset: Int): TasksResult!
  task(id: ID!): Task
}

type Mutation {
  addTask(title: String!): Task!
  updateTask(id: ID!, status: String!): Task!
  deleteTask(id: ID!): ID!
}

type Subscription {
  taskAdded: Task!
  taskUpdated: Task!
  taskDeleted: ID!
}

`;