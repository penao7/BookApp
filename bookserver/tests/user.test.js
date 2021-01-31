/* eslint-disable */
import mongoose from 'mongoose';
import server from '../server.js';
import supertest from 'supertest';
import User from '../models/userSchema';
import * as database from '../utils/database';
import {
  createInitialUsers,
  getMe
} from './test_help';

database.connect();
const api = supertest(server);

afterAll(async (done) => {
  await mongoose.connection.close();
  done();
});

describe('users', () => {
  beforeEach(() => {
    User.deleteMany({});
  });
  describe('when there are no initial users', () => {
    beforeEach(async () => {
      await User.deleteMany({});
    });

    test("create new user succesfully and return username", async () => {
      const newUser = await api
        .post('/graphql')
        .send({
          query:
            `mutation {createUser(
            username: "pena",
            password: "testisalasana",
            role: "ADMIN",
            favoriteGenre: "classic"
          ) {username, id}}
            `})
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(newUser.body.data.createUser.username).toEqual('pena');

      const user = await User.findById(newUser.body.data.createUser.id);
      expect(user.username).toEqual('pena');
    });
  });

  describe('when there are initial users created', () => {
    beforeEach(async () => {
      await createInitialUsers(api);
    });

    test('login succesfully', async () => {
      const token = await api
        .post('/graphql')
        .send({
          query:
            `mutation {login(
              username: "pena",
              password: "testisalasana"
            ){value}}
            `
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(token.body.data.login.value).not.toBe('');
    });

    test('login succesfully and get current user', async () => {
      const token = await api
        .post('/graphql')
        .send({
          query:
            `mutation {login(
              username: "pena",
              password: "testisalasana"
            ){value}}
            `
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(token.body.data.login.value).not.toBe('');

      const user = await getMe(api, token.body.data.login.value);

      expect(user.username).toEqual('pena')
      expect(user.role).toEqual('ADMIN')

    });

    test('cannot return current user without valid token', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmO';

      const user = await getMe(api, token);

      expect(user.message).toEqual('Your session has expired. Log in again');
    });

    test('return error when login with wrong username', async () => {
      const token = await api
        .post('/graphql')
        .send({
          query:
            `mutation {login(
              username: "wrong",
              password: "credentials"
            ){value}}
            `
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(token.body.errors[0].message).toEqual('invalid username');
    });

    test('return error when login with wrong password', async () => {
      const token = await api
        .post('/graphql')
        .send({
          query:
            `mutation {login(
              username: "pena",
              password: "credentials"
            ){value}}
            `
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(token.body.errors[0].message).toEqual('invalid password');
    });

    test('login as an admin and get userlist succesfully', async () => {
      const user = await api
        .post('/graphql')
        .send({
          query:
            `mutation {login(
              username: "pena",
              password: "testisalasana"
            ){value}}
            `
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = user.body.data.login.value;

      const userList = await api
        .post('/graphql')
        .send({
          query:
            `query {allUsers{username, role, favoriteGenre}}`
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);


      expect(userList.body.data.allUsers.length).toBe(2);
      expect(userList.body.data.allUsers[0].username).toEqual('pena');
      expect(userList.body.data.allUsers[1].username).toEqual('testi');

    })

    test('login as normal user and get userlist unsuccesfully', async () => {
      const user = await api
        .post('/graphql')
        .send({
          query:
            `mutation {login(
              username: "testi",
              password: "testisalasana"
            ){value}}
            `
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = user.body.data.login.value;

      const userList = await api
        .post('/graphql')
        .send({
          query:
            `query {allUsers{username, role, favoriteGenre}}`
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(userList.body.errors[0].message).toEqual('not authorized');

    })
  })
});

