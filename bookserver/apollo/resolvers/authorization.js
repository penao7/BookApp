import apollo from 'apollo-server';
import graphqlresolvers from 'graphql-resolvers';

const { AuthenticationError } = apollo;
const { skip, combineResolvers } = graphqlresolvers;

export const isAuthenticated = (root, args, { currentUser }) => {
  return currentUser ? skip : new AuthenticationError('not authenticated');
};

export const isAdmin = combineResolvers(
  isAuthenticated,
  (root, args, { currentUser: { role } }) => {
    return (
      role === 'ADMIN'
        ? skip
        : new AuthenticationError('not authorized')
    );
  }
);
