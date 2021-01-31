import apollo from 'apollo-server-express';
import graphqlresolvers from 'graphql-resolvers';
import { isAuthenticated } from './authorization.js';

const { UserInputError } = apollo;
const { combineResolvers } = graphqlresolvers;

import Author from '../../models/authorSchema.js';

export default {
  Query: {
    authorCount: () => Author.collection.countDocuments(),
    allAuthors: () => Author.find({}),
  },
  Author: {
    bookCount: async (author, args, { loader }) => {
      return await loader.load(author._id);
    }
  },
  Mutation: {
    editAuthor: combineResolvers(
      isAuthenticated,
      async (root, args) => {

        const author = await Author.findOne({ name: args.name });

        try {

          if (!author) {
            throw new UserInputError('author field cannot be empty');
          }

          if (!args.born) {
            throw new UserInputError('year of born cannot be empty');
          }

          if (args.born.toString().length !== 4) {
            throw new UserInputError('year of born must be 4 digits');
          }

          author.born = args.born;

          await author.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          });
        }

        return author;
      }
    )
  }
};
