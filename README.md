# Apollo Server Telegram Tasks Backend

A GraphQL backend for a Telegram Mini App To-Do Board, built with TypeScript, Apollo Server, Prisma ORM, and PostgreSQL.
Supports real-time updates via GraphQL subscriptions and is ready for deployment on platforms like Render.

---

## 🚀 Launch Instructions

### 1. **Clone the repository**

```bash
git clone <your-repo-url>
cd apollo-server
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Set up environment variables**

Create a `.env` file in the root with:

```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
```

Replace with your actual PostgreSQL connection string.

### 4. **Run Prisma migrations and generate client**

```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. **Build the project**

```bash
npm run build
```

### 6. **Start the server**

```bash
node ./dist/index.js
```

The server will be available at [http://localhost:3000/graphql](http://localhost:3000/graphql).

---

## 🏗️ Architecture Description

### **Backend**

- **Apollo Server + Express**: Serves a GraphQL API for tasks CRUD and subscriptions.
- **Prisma ORM + PostgreSQL**: For persistent task storage and type-safe DB access.
- **graphql-ws + ws**: For real-time GraphQL subscriptions over WebSockets.
- **PubSub**: In-memory event bus for real-time updates (suitable for dev/small scale).

---

## 📁 Folder Structure

```
apollo-server/
├── prisma/
│   └── schema.prisma         # Prisma schema (models, enums, datasource)
├── src/
│   ├── db.ts                 # Database access and business logic
│   ├── index.ts              # Server entry point (HTTP + WebSocket)
│   ├── server.ts             # GraphQL resolvers
│   ├── lib/
│   │   ├── typeDefs.ts       # GraphQL schema definition
│   │   └── pubsub.ts         # PubSub event bus for subscriptions
│   └── generated/
│       └── prisma/           # (If present) Generated Prisma files
├── package.json
├── tsconfig.json
└── ...
```

---

## 🧩 Key Components

- **GraphQL Schema**: Located in `src/lib/typeDefs.ts`
- **Resolvers**: Located in `src/server.ts`
- **Database Logic**: Located in `src/db.ts`
- **Prisma Schema**: Located in `prisma/schema.prisma`
- **PubSub**: Located in `src/lib/pubsub.ts`

---

## 🧬 Example GraphQL Operations

### **Query (Tasks with Pagination)**

```graphql
query TasksQuery($status: String, $sortBy: String, $limit: Int, $offset: Int) {
  tasks(status: $status, sortBy: $sortBy, limit: $limit, offset: $offset) {
    tasks {
      id
      title
      status
    }
    totalCount
    hasMore
  }
}
```

### **Mutation (Add Task)**

```graphql
mutation AddTask($title: String!) {
  addTask(title: $title) {
    id
    title
    status
  }
}
```

### **Subscription (Task Added)**

```graphql
subscription {
  taskAdded {
    id
    title
    status
  }
}
```

---

## ⚡ Endpoints

- **HTTP (queries & mutations):**
  `https://apollo-server-cwzu.onrender.com/graphql`
- **WebSocket (subscriptions):**
  `wss://apollo-server-cwzu.onrender.com/graphql`
