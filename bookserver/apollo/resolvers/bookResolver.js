import apollo from 'apollo-server-express';
import { isAuthenticated, isAdmin } from './authorization.js';
import graphqlresolvers from 'graphql-resolvers';

const { UserInputError, AuthenticationError, PubSub } = apollo;
const { combineResolvers } = graphqlresolvers;
const pubsub = new PubSub();

import Book from '../../models/bookSchema.js';
import Author from '../../models/authorSchema.js';

export default {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    getBookById: (root, { id }) => Book.findById(id).populate('author'),
    getGenres: async () => {
      const genreList = [];
      const books = await Book.find({});
      books.forEach(b => b.genres.forEach(g => genreList.some(gnr => gnr === g) ? '' : genreList.push(g)));
      return genreList;
    },
    allBooks: async (root, { author, genre, title, limit = 10, offset = 0 }) => {

      if (author && genre) {
        return Book
          .paginate({
            author: author,
            genres: {
              $in: [genre]
            }
          },
          {
            populate: 'author',
            sort: { title: 'asc' },
            collation: {
              locale: 'en'
            },
            limit: limit,
            offset: offset
          })
          .then(data => {
            return { docs: data.docs };
          });
      }

      if (title) {
        return Book.find({ title: title }).populate('author');
      }

      if (author) {
        const author = Author.findOne({ name: author });
        return Book
          .paginate({
            id: author._id
          },
          {
            populate: 'author',
            sort: { title: 'asc' },
            collation: {
              locale: 'en'
            },
            limit: limit,
            offset: offset
          })
          .then(data => {
            return { docs: data.docs };
          });
      }

      if (genre) {
        return Book
          .paginate({
            genres: {
              $in: [genre]
            },
          },
          {
            populate: 'author',
            sort: { title: 'asc' },
            collation: {
              locale: 'en'
            },
            limit: limit,
            offset: offset
          })
          .then(data => {
            return { docs: data.docs };
          }
          );
      }

      return Book.paginate({}, {
        populate: 'author',
        sort: { title: 'asc' },
        collation: {
          locale: 'en'
        },
        limit: limit,
        offset: offset
      })
        .then(data => {
          return {
            docs: data.docs,
            pageInfo:
            {
              pages: data.totalPages,
              nextPage: data.nextPage,
              prevPage: data.prevPage,
              currentPage: data.currentPage
            }
          };
        });
    }
  },
  Mutation: {
    addBook: combineResolvers(
      isAuthenticated,
      async (root, args) => {

        const newBook = new Book({ ...args });

        const checkedAuthor = await Author.findOne({ name: args.author });

        if (!checkedAuthor) {
          const newAuthor = new Author({ name: args.author });
          await newAuthor.save();
        }

        try {
          const author = await Author.findOne({ name: args.author });
          newBook.author = author;
          await newBook.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          });
        }

        pubsub.publish('BOOK_ADDED', { bookAdded: newBook });

        return newBook;
      },
    ),
    deleteBook: combineResolvers(
      isAdmin,
      async (root, { id }) => {
        let result;

        try {
          result = await Book.findByIdAndDelete(id).populate('author');
        } catch (err) {
          new AuthenticationError(err.message);
        }

        pubsub.publish('BOOK_DELETED', { bookDeleted: result });
        return result;
      }
    )
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
    bookDeleted: {
      subscribe: () => pubsub.asyncIterator(['BOOK_DELETED'])
    }
  }
};
