import apollo from 'apollo-server-express';
const { gql } = apollo;

export default gql`

  extend type Query {
    allAuthors(author: String): [Author!]!
    authorCount: Int!
  }

  extend type Mutation {
    editAuthor (
      name: String!
      born: Int
    ): Author
  }

  type Author {
    name: String!
    bookCount: Int!
    born: Int
    id: ID!
  }
`;
