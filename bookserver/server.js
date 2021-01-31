import express from 'express';
import cors from 'cors';
import http from 'http';
import * as database from './utils/database.js';
import * as apollo from './apollo/apollo.js';
import config from './utils/config.js';

// MongoDB connection

database.connect();

const app = express();

app.use(cors());

apollo.server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
apollo.server.installSubscriptionHandlers(httpServer);

if (config.NODE_ENV !== 'TEST') {
  httpServer.listen({ port: 4000 }, () => {
    console.log('connected to Apollo server');
  });
}

export default httpServer;