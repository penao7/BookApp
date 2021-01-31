import React, { useState, useEffect } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recommendations';
import UserList from './components/UserList';
import Navigation from './components/Navigation';
import { useApolloClient, useQuery, useSubscription } from '@apollo/client';
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, BOOK_DELETED, GET_USER } from './queries';

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const client = useApolloClient();
  const user = useQuery(GET_USER)

  const includedIn = (set, object) => {
    return set.some(b => b.id === object.id);
  };

  const updateCacheWith = (addedBook) => {

    try {
      const dataInStore = client.readQuery({ query: ALL_BOOKS })
      const authorStore = client.readQuery({ query: ALL_AUTHORS });

      if (addedBook) {

        if (!includedIn(dataInStore.allBooks.docs, addedBook)) {
          setMessage(`new book ${addedBook.title} added`)
          client.writeQuery({
            query: ALL_BOOKS,
            data:
              { allBooks: { ...dataInStore.allBooks, docs: dataInStore.allBooks.docs.concat(addedBook) } }
          });
        };

        if (!includedIn(authorStore.allAuthors, addedBook.author)) {
          client.writeQuery({
            query: ALL_AUTHORS,
            data:
              { allAuthors: authorStore.allAuthors.concat(addedBook.author) }
          })
        };
      }
    } catch (err) {
      console.log(err)
    };
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      updateCacheWith(addedBook);
    }
  });

  useSubscription(BOOK_DELETED, {
    onSubscriptionData: async ({ subscriptionData }) => {

      const deletedBook = subscriptionData.data.bookDeleted;
      const dataInStore = await client.readQuery({ query: ALL_BOOKS });

      if (includedIn(dataInStore.allBooks.docs, deletedBook)) {
        client.writeQuery({
          query: ALL_BOOKS,
          data:
            { allBooks: { docs: dataInStore.allBooks.docs.filter(b => b.id !== deletedBook.id) } }
        });
        setMessage(`book with title '${deletedBook.title} deleted`)
      };
    }
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage('authors');
    setMessage('logged out succesfully');
  };

  useEffect(() => {

    if (localStorage.getItem('bookappuser')) {
      setToken(localStorage.getItem('bookappuser'));
    };
  }, [])

  return (
    <div>
      <div>
        <Navigation
          user={user}
          setPage={setPage}
          token={token}
          logout={logout}
          message={message}
          setMessage={setMessage}
        />
      </div>
      <div>
        <Authors
          show={page === 'authors'}
          setMessage={setMessage}
          token={token}
          logout={logout}
        />

        <Books
          show={page === 'books'}
          setMessage={setMessage}
          logout={logout}
        />

        <NewBook
          show={page === 'add'}
          setMessage={setMessage}
          updateCacheWith={updateCacheWith}
          logout={logout}
        />

        <LoginForm
          show={page === 'login'}
          setMessage={setMessage}
          setToken={setToken}
          setPage={setPage}
        />

        <Recommendations
          show={page === 'recommendations'}
          setMessage={setMessage}
        />

        {
          (token && user.data && user.data.me && user.data.me.role === 'ADMIN')
            ?
            <UserList
              show={page === 'userlist'}
              setMessage={setMessage}
            />
            : ""
        }

      </div>
    </div>
  );
};

export default App;
