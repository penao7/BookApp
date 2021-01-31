# Book-App Server

This server is implemented using [Apollo GraphQL](/https://www.apollographql.com/) server for [Book-App Client](/BookApp/bookclient).

## Usage

```
$ npm install
$ npm run start
```

Now you can access GraphQL playground at http://localhost:4000/graphql.

If a token is needed, you can add it to HTTP HEADERS tab below the query editor after logging in (see Login below to acquire token):

```graphql
{
  "Authorization": "Bearer <ACCESS_TOKEN>"
}
```
  
## Roles

When adding a user, user role can be defined as an `ADMIN` or `USER` (see Signup below). 

### USER features:
- Login
- Adding books
- Recommendations tab which lists all the books which are in favorite genre defined in signup

### ADMIN features:
 
All USER features but additionally

 - Delete books
 - List users
 - Change born date of authors

### Users

Signup:

```graphql  
mutation { 
  createUser(username: "test", password: "example", favoriteGenre: "adventure", role: "USER", ) {
      id
      username
      favoritegenre
  }
}
```

Login (to get token):

```graphql
mutation {
  login(username: "test", password: "example") {
  value 
  }
}
```

To get information from the token (token required):

```graphql
query {
  me {
    username,
    role,
    id, 
    favoriteGenre
  }
}
```

### Books

Get all the books with pageInfo:

```graphql
query {
  allBooks {
    docs {
      title, 
      genres, 
      published,
      author {
        name, 
        born, 
        bookCount
      }
    }
    	pageInfo {
        pages, 
        prevPage, 
        nextPage
      }
  }
}
```

Add a book (token required):

```graphql
mutation {
  addBook(title: "Gone with the Wind", author: "Margaret Mitchell", published: 1936, genres: "Romance") {
  	id
  	published
  	genres
  	title
  	author {
      name
      born
    }
  }
}
```
If there is no author with that name already, it will be automatically created.

Get the total number of books added:

```graphql
query {
  bookCount
}
```

### Authors

Get all authors:

```graphql
query {
  allAuthors{
    name
    bookCount
    born
  }
}
```

Change author born year by name (token required):

```graphql
mutation {
  editAuthor(name: "Margaret Mitchell", born: 1900) {
    name,
    born
  }
}
```


Get the total number of authors added:

```graphql
query {
  authorCount
}