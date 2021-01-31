import React from 'react';

const MessageHandler = ({ message, setMessage }) => {

  if (message) {

    setTimeout(() => {
      setMessage('')
    }, 2000);

    return <div style={{ color: 'red' }}>{message}</div>
  };

  return '';

};

export default MessageHandler;