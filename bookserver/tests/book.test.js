/* eslint-disable */
import mongoose from 'mongoose';
import server from '../server.js';
import supertest from 'supertest';
import User from '../models/userSchema';
import Book from '../models/bookSchema';
import Author from '../models/authorSchema';
import * as database from '../utils/database';
import {
  loginAsUser,
  loginAsAdmin,
  createInitialUsers,
  createBook,
  initialBooks,
  deleteBook,
  getGenres
} from './test_help';

database.connect();
const api = supertest(server);

afterAll(async (done) => {
  await mongoose.connection.close();
  done();
});

describe('books', () => {
  beforeEach(async () => {
    await Book.deleteMany({});
    await Author.deleteMany({});
    await User.deleteMany({});
    await createInitialUsers(api);
  });
  describe('without authentication', () => {

    test("get all books", async () => {
      const result = await api
        .post("/graphql")
        .send({
          query: "query {allBooks{docs{title}}}"
        });

      expect(result).not.toBeNull();
    });

    test("try to add book and get error", async () => {
      const result = await api
        .post("/graphql")
        .send({
          query: `mutation {addBook(
          title: "testbook",
          author: "tester"
          published: 2005,
          genres: ["horror", "adventure"]
          ) {
              title,
              author {
                name
              },
              published,
              genres
            }
          }
         `
        })
        .expect(200)
        .expect("Content-Type", /application\/json/);
      expect(result.body.errors[0].message).toEqual('not authenticated');
    });
  })

  describe('with authentication', () => {
    test("succesfully create a book and add an author", async () => {

      const newBook = await createBook(api);

      const author = await Author.findById(newBook.author.id);
      const bookList = await Book.find({});

      expect(newBook.title).toEqual('testbook');
      expect(bookList.length).toBe(1);
      expect(author.name).toEqual('tester');
      expect(newBook.author.bookCount).toBe(1);

    });

    test("succesfully create a book and attach it to an existing author", async () => {

      const token = await loginAsUser(api);
      const initialBook = await createBook(api);

      expect(initialBook.author.name).toEqual('tester');

      const newBook = await api
        .post("/graphql")
        .send({
          query: `mutation {addBook(
            title: "testbook2",
            author: "tester"
            published: 2005,
            genres: ["classic", "science"]
            ) {
                title,
                author {
                  name
                  id
                  bookCount
                },
                published,
                genres
              }
            }
           `
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const author = await Author.findById(newBook.body.data.addBook.author.id);
      const bookList = await Book.find({});

      expect(newBook.body.data.addBook.author.name).toEqual('tester');
      expect(bookList.length).toBe(2);
      expect(author.name).toEqual('tester');
      expect(newBook.body.data.addBook.author.bookCount).toBe(2);
    });

    test("try to delete a book as a normal user and get an error", async () => {

      const token = await loginAsUser(api);
      const newBook = await createBook(api);

      expect(newBook.title).toEqual('testbook');

      const id = newBook.id;
      const variables = { id: id };

      const deleteBook = await api
        .post('/graphql')
        .send({
          query:
            `mutation deleteBook($id: ID!){deleteBook(id: $id){title}}`, variables
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(deleteBook.body.errors[0].message).toEqual('not authorized');

    });
    test("succesfully delete book as a admin", async () => {

      const token = await loginAsAdmin(api);

      const result = await api
        .post("/graphql")
        .send({
          query: `mutation {addBook(
            title: "testbook",
            author: "tester"
            published: 2005,
            genres: ["horror", "adventure"]
            ) {
                id,
                title,
                author {
                  name
                },
                published,
                genres
              }
            }
           `
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(result.body.data.addBook.title).toEqual('testbook');

      const id = result.body.data.addBook.id;
      const variables = { id: id };

      const createdBook = await Book.findById(id);
      expect(createdBook.title).toEqual('testbook');

      await api
        .post('/graphql')
        .send({
          query:
            `mutation deleteBook($id: ID!){deleteBook(id: $id){title}}`, variables
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const deletedBook = await Book.findById(id);

      expect(deletedBook).toBe(null);

    });
  })

  describe('with initial books added', () => {
    beforeEach(async () => {
      await Book.insertMany(initialBooks);
    });

    test('there are five initial books added', async () => {
      const bookList = await Book.find({});
      expect(bookList.length).toBe(5);
    });

    describe('genres', () => {

      test('genreList returns right amount of genres with no duplicates', async () => {
        const initialGenreList = await getGenres(api);

        expect(initialGenreList.length).toBe(6);
        expect(initialGenreList).toEqual([
          'adventure',
          'fantasy',
          'science',
          'horror',
          'nature',
          'classic'
        ]);
      });

      test('get books in specific genre when genre is fantasy', async () => {

        const variables = { genre: 'fantasy' };
        const result =
          await api
            .post('/graphql')
            .send({
              query:
                `query
                  allBooks($genre: String!) {
                    allBooks(genre: $genre) {
                      docs {
                        title, 
                        genres
                      }
                    }
                  }
                `, variables
            })
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const genreBookList = result.body.data.allBooks.docs;

        genreBookList.map(b => {
          expect(b.genres.some(genre => genre === 'fantasy')).toBe(true);
        });
      });

      test('deleting a book deletes also the genre if there are no more books in that genre ', async () => {
        const genreListBefore = await getGenres(api);
        expect(genreListBefore).toContain('science');

        const scienceBook = await Book.findOne({ title: 'sciencebook' });
        expect(scienceBook).not.toBeNull();

        const deletedBook = await deleteBook(api, scienceBook.id);
        expect(deletedBook).not.toBeNull();

        const genreListAfter = await getGenres(api);
        expect(genreListAfter).not.toContain('science');

      });
    });
  })
})