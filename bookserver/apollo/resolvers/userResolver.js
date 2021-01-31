import apollo from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import config from '../../utils/config.js';
import bcrypt from 'bcrypt';
import { isAdmin } from './authorization.js';
import graphqlresolvers from 'graphql-resolvers';

const { UserInputError, AuthenticationError } = apollo;
const { combineResolvers } = graphqlresolvers;

const JWT_SECRET = config.JWT_SECRET;

import User from '../../models/userSchema.js';

export default {
  Query: {
    me: (root, args, { currentUser }) => {
      return currentUser;
    },
    allUsers: combineResolvers(
      isAdmin,
      () => {
        return User.find({});
      }
    ),
  },
  Mutation: {
    createUser: async (root, { username, password, role, favoriteGenre }) => {
      const saltRound = 10;
      const passwordHash = await bcrypt.hash(password, saltRound);
      const user = new User({ username: username, password: passwordHash, role: role, favoriteGenre: favoriteGenre });

      return user.save()
        .catch(err => {
          throw new UserInputError(err.message, {
            invalidArgs: username
          });
        });
    },
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username: username });

      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.password);

      if (!user) {
        throw new UserInputError('invalid username');
      }

      if (!passwordCorrect) {
        throw new AuthenticationError('invalid password');
      }

      const userForToken = {
        id: user._id,
        username: user.username,
        role: user.role,
      };

      return {
        value: jwt.sign(userForToken, JWT_SECRET, {
          expiresIn: '2h'
        })
      };

    }
  },
};
