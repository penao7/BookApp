/* eslint-disable */
import mongoose from 'mongoose';
import server from '../server.js';
import supertest from 'supertest';
import * as database from '../utils/database';
import Author from '../models/authorSchema';
import User from '../models/userSchema';
import Book from '../models/bookSchema';
import { createInitialUsers, createBook, loginAsAdmin, changeYearOfBorn, loginAsUser } from './test_help.js';

database.connect();
const api = supertest(server);

afterAll(async (done) => {
  await mongoose.connection.close();
  done();
});

describe('authors', () => {
  beforeEach(async () => {
    await Author.deleteMany({});
    await Book.deleteMany({});
    await User.deleteMany({});
    await createInitialUsers(api);
  });

  test('get all authors', async () => {
    const result =
      await api
        .post('/graphql')
        .send({
          query:
            `query {
              allAuthors {
                name, 
                born,
                bookCount
              }
            }
            `
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(result.body.data.allAuthors.length).not.toBeNull();
    expect(result.body.data.allAuthors.length).toBe(0);
  });
  test('create book and author as an user', async () => {

    const book = await createBook(api);
    const author = await Author.findById(book.author.id);

    expect(author).not.toBeNull();
    expect(author.name).toEqual(book.author.name);
    expect(book.author.bookCount).toEqual(1);

  });
  test('succesfully change year of born as an admin', async () => {

    const token = await loginAsAdmin(api);

    const book = await createBook(api);
    expect(book.author.born).toBeNull();

    const newYearOfBorn = 1972;
    const newAuthor = await changeYearOfBorn(api, book.author.name, newYearOfBorn, token);
    expect(newAuthor.born).toEqual(newYearOfBorn);

  });
  test('return error when changing year of born unauthenticated', async () => {

    const token = '';

    const book = await createBook(api);
    expect(book.author.born).toBeNull();

    const newYearOfBorn = 1972;
    const newAuthor = await changeYearOfBorn(api, book.author.name, newYearOfBorn, token);
    expect(newAuthor.message).toEqual('not authenticated');

  });
});


