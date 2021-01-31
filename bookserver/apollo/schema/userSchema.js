import apollo from 'apollo-server-express';
const { gql } = apollo;

export default gql`

  extend type Mutation {
    createUser(
      username: String!
      password: String!
      role: String!
      favoriteGenre: String
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type User {
    username: String!
    role: String!
    favoriteGenre: String
    id: ID!
  }

  type Token {
    value: String!
  }

  extend type Query {
    me: User
    allUsers: [User]!

  }

`;
