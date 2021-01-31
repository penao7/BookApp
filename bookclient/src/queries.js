import { gql } from '@apollo/client';

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    published 
    author {
      bookCount
      name
      born
      id
    }
    genres
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const BOOK_DELETED = gql`
  subscription {
    bookDeleted {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const ALL_BOOKS = gql`
query allBooks($offset: Int) {
    allBooks(offset: $offset) {
      docs {
        ...BookDetails
      }
      pageInfo {
        pages
        nextPage
        prevPage
      }
    }
  }
  ${BOOK_DETAILS}
`

export const ALL_AUTHORS = gql`
  query allAuthors {
    allAuthors {
      name,
      born,
      bookCount,
      id
    }
  }
`

export const FIND_BOOK = gql`
  query getBookById($id: ID!) {
    getBookById(id: $id) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const GET_GENRES = gql`
  query getGenres{getGenres}
`

export const GET_BOOKS_BY_GENRE = gql`
  query getBooksByGenre($genre: String!) {
    allBooks(genre: $genre) {
      docs {
        ...BookDetails
      }
    }
  }
  ${BOOK_DETAILS}
`

export const CREATE_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook (
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int) {
    editAuthor(
      name: $name, 
      born: $setBornTo
    ) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const GET_USER = gql`
  query getUser {
    me {
      username, 
      favoriteGenre,
      role
    }
  }
`

export const GET_USERLIST = gql`
  query getUsers {
    allUsers {
      id,
      username,
      favoriteGenre
      role
    }
  }
`

export const DELETE_BOOK = gql`
  mutation deleteBook($id: ID!) {
    deleteBook(id: $id) {
      title
    }
  }
`