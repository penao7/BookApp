import apollo from 'apollo-server-express';
const { gql } = apollo;

export default gql`

  extend type Query {
    bookCount: Int!
    allBooks(author: String, genre: String, title: String, limit: Int, offset: Int): BookConnection!
    getBookById(id: ID!): Book!
    getGenres: [String!]
  }

  extend type Mutation {
    addBook (
      title: String!
      author: String!
      published: Int
      genres: [String!]!
    ): Book
    deleteBook (
      id: ID!
    ): Book!
  }

  type BookConnection {
    docs: [Book!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    pages: Int!
    nextPage: Int
    prevPage: Int
  }

  extend type Subscription {
    bookAdded: Book!
    bookDeleted: Book!
  }

  type Book {
    title: String!
    author: Author!
    published: Int
    genres: [String!]!
    id: ID!
  }
`;
