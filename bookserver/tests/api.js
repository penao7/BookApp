import axios from 'axios';

const API_URL = 'http://localhost:4000/graphql';

export const user = async variables =>
  axios.post(API_URL, {
    query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          username
          favoriteGenre
          role
        }
      }
    `,
    variables,
  });

export const allUsers = () =>
  axios.post(API_URL, {
    query: `
      query {
        allUsers {
          id
          username
          favoriteGenre
          role
        }
      }
    `
  });

export const login = async variables => {
  console.log(variables);
  axios.post(API_URL, {
    query: `
      mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)  {
          value
        }
      }
    `,
    variables
  });
};

export const createUser = async variables => {
  axios.post(API_URL, {
    query: `
      mutation createUser($username: String!, $password: String!, $role: String!, $favoriteGenre: String) {
        createUser(username: $username, password: $password, role: $role , favoriteGenre: $favoriteGenre) {
          username
        }
      }
    `,
    variables
  });
};