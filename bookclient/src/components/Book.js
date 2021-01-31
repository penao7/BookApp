import React from 'react';

const Book = ({book, setBook}) => {
  return (
    <div>
      <h2>{book.title}</h2>
      <div>{book.author.name}</div>
      <div>{book.published}</div>
      <div>{book.genres.map(g => g).join(", ")}</div>
      <button onClick={() => setBook('')}>close</button>
    </div>
  )
};

export default Book;