export const initialBooks = [
  {
    title: 'adventurebook',
    author: '5f7b192c54aa2f183058b25b',
    published: 2005,
    genres: ['adventure', 'fantasy']
  },
  {
    title: 'sciencebook',
    author: '5f7b192c54aa2f183058b25b',
    published: 1966,
    genres: ['science', 'adventure']
  },
  {
    title: 'horrorbook',
    author: '5f7b192c54aa2f183058b25b',
    published: 2011,
    genres: ['horror', 'fantasy', 'adventure']
  },
  {
    title: 'naturebook',
    author: '5f7b192c54aa2f183058b25b',
    published: 2022,
    genres: ['nature', 'fantasy']
  },
  {
    title: 'classic',
    author: '5f7b192c54aa2f183058b25b',
    published: 1922,
    genres: ['classic', 'fantasy', 'adventure']
  },
];

export const createInitialUsers = async (api) => {
  await api
    .post('/graphql')
    .send({
      query:
        `mutation {createUser(
            username: "pena",
            password: "testisalasana",
            role: "ADMIN",
            favoriteGenre: "classic"
          ) {username, id}}
            ` })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  await api
    .post('/graphql')
    .send({
      query:
        `mutation {createUser(
            username: "testi",
            password: "testisalasana",
            role: "USER",
            favoriteGenre: "adventure"
          ) {username, id}}
            ` })
    .expect(200)
    .expect('Content-Type', /application\/json/);
};

export const loginAsUser = async (api) => {
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
    .expect('Content-Type', /application\/json/);

  const token = user.body.data.login.value;
  return token;
};

export const loginAsAdmin = async (api) => {
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
    .expect('Content-Type', /application\/json/);

  const token = user.body.data.login.value;
  return token;
};

export const createBook = async (api) => {

  const token = await loginAsUser(api);

  const book = await api
    .post('/graphql')
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
              id,
              name,
              bookCount,
              born
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

  return book.body.data.addBook;

};

export const deleteBook = async (api, id) => {

  const variables = { id: id };

  const token = await loginAsAdmin(api);
  const result =
    await api
      .post('/graphql')
      .send({
        query:
          `mutation 
        deleteBook($id: ID!) {
          deleteBook(id: $id) {
            id
          }
        }
      `, variables
      })
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

  return result.body.data.deleteBook.id;

};

export const getGenres = async (api) => {
  const result = await api
    .post('/graphql')
    .send({
      query:
        'query {getGenres}'
    })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  return result.body.data.getGenres;
};

export const getMe = async (api, token) => {
  const result = await api
    .post('/graphql')
    .send({
      query:
        `query {
          me {
            id
            username,
            role,
            favoriteGenre,
          }
        }
        `
    })
    .set('Authorization', `bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  if (result.body.errors) {
    return result.body.errors[0];
  }

  return result.body.data.me;

};

export const changeYearOfBorn = async (api, name, born, token) => {
  const variables = { name: name, born: born };

  const result =
    await api
      .post('/graphql')
      .send({
        query:
          `
          mutation editAuthor($name: String!, $born: Int!) {
            editAuthor(name: $name, born: $born) {
              name,
              born
            }
          }
        `, variables
      })
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

  if (result.body.errors) {
    return result.body.errors[0];
  } else {
    return result.body.data.editAuthor;
  }

};