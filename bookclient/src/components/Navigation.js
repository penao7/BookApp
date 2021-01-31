import React from 'react';
import MessageHandler from './MessageHandler';

const Navigation = ({
  user,
  setPage,
  message,
  setMessage,
  token,
  logout
}) => {

  return (
    (token && user.data && user.data.me && user.data.me.role === 'ADMIN')
      ?
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommendations')}>recommendations</button>
        <button onClick={() => setPage('userlist')}>users</button>
        <button onClick={() => logout()}>logout</button>
        <MessageHandler message={message} setMessage={setMessage} />
      </div>
      :
      token
        ?
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommendations')}>recommendations</button>
          <button onClick={() => logout()}>logout</button>
          <MessageHandler message={message} setMessage={setMessage} />
        </div>
        :
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
          <MessageHandler message={message} setMessage={setMessage} />
        </div>
  )
};

export default Navigation 