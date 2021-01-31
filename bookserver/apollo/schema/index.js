import apollo from 'apollo-server-express';
import userSchema from './userSchema.js';
import bookSchema from './bookSchema.js';
import authorSchema from './authorSchema.js';

const { gql } = apollo;

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, bookSchema, authorSchema, userSchema];