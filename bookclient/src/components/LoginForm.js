import React, { useEffect, useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { LOGIN, GET_USER, ALL_BOOKS, ALL_AUTHORS } from '../queries';

const LoginForm = ({ setToken, setMessage, setPage, show }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [getUser] = useLazyQuery(GET_USER, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });
  const [getBooks] = useLazyQuery(ALL_BOOKS);
  const [getAuthors] = useLazyQuery(ALL_AUTHORS);

  const [login, loginResult] = useMutation(LOGIN, {
    onError: (error) => {
      setMessage(error.message)
    },
    onCompleted: () => {
      getUser();
      getAuthors();
      getBooks();
    }
  });

  useEffect(() => {
    if (loginResult.data) {
      const token = loginResult.data.login.value;
      setToken(token)
      localStorage.setItem('bookappuser', token);
      setMessage('succesfully logged in');
      setPage('authors');
    }
  }, [loginResult.data]); // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  if (!show) {
    return ''
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
};

export default LoginForm;