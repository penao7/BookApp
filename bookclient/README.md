# Book-App Client

Client implementation for [Book-App Server](/bookserver). Created by using React and [Apollo Client](https://www.apollographql.com/docs/react/).

## Features:

### Booklist

- list of all the added books
- pagination
- open and close book details

### AuthorList

- list of all the added authors with books
- number of how many books author has in the system

### Add a book

- adding a book feature shown for logged in users

### Recommendations

- list of books filtered by favorite genre only shown for logged in user.

### Users

- list of users, only shown for logged in `ADMIN` user

## Permissions

#### Non authorized users:

- can see the books and authors list's

#### Logged in users:

- can list books by favorite genre in recommendations tab
- can add books

#### Logged in admins:

- can list users
- can delete books
- can change born date of authors

## Usage

```bash
$ npm install
$ npm run start
```

by default api URL is defined as
```
API_URL = http://localhost:4000/graphql
```


