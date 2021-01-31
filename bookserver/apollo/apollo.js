import apollo from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import config from '../utils/config.js';

const { ApolloServer, AuthenticationError } = apollo;
const JWT_SECRET = config.JWT_SECRET;

// GraphQl

import resolvers from './resolvers/index.js';
import typeDefs from './schema/index.js';

// Mongoose

import Book from '../models/bookSchema.js';
import User from '../models/userSchema.js';

const getMe = async req => {

  const auth = req ? req.headers.authorization : null;

  if (auth && auth.toLocaleLowerCase().startsWith('bearer ')) {
    try {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET);

      return await User.findById(decodedToken.id);

    } catch (err) {
      return new AuthenticationError(
        'Your session has expired. Log in again',
      );
    }
  }
};

const batchBookCounts = async (keys) => {
  const books = await Book.find({});
  return keys.map(k => books.filter(b => b.author.equals(k)).length);
};

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: err => {

    const message = err.message
      .replace('Validation error ', '')
      .replace('Author validation failed: name: ', '')
      .replace('Book validation failed: title: ', '')
      .replace('Context creation failed: ', '')
      .replace('User validation failed: username: ', '');

    return {
      ...err,
      message
    };
  },
  context: async ({ req }) => {
    const currentUser = await getMe(req);
    return { currentUser, loader: new DataLoader(keys => batchBookCounts(keys)) };
  }
});
