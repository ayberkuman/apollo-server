import { ApolloServer } from '@apollo/server';
import { createServer } from 'http';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import express from 'express';
import { resolvers } from './server.js';
import { useServer } from 'graphql-ws/lib/use/ws';
import bodyParser from 'body-parser';
import { WebSocketServer } from 'ws';
import { typeDefs } from './lib/typeDefs.js';

const port = 3000;



const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const wsServerCleanup = useServer({ schema }, wsServer);

const apolloServer = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await wsServerCleanup.dispose();
          }
        };
      },
    },

  ]
});



await apolloServer.start();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use('/graphql', bodyParser.json(), expressMiddleware(apolloServer));

httpServer.listen(port, () => {
  console.log(`🚀 Query endpoint ready at http://localhost:${port}/graphql`);
  console.log(`🚀 Subscription endpoint ready at ws://localhost:${port}/graphql`);
});