import React from 'react';

const BooksByGenre = ({ selectedGenre, genreBooks, handleDeleteBook, showBook, filterByGenre, user, genres }) => {
  return (
    <div>
      <h2>Books by genre {selectedGenre}</h2>
      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {genreBooks.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
              <td><button onClick={() => showBook(b.id)}>show</button></td>
              {
                (user && user.me && user.me.role === 'ADMIN')
                  ? <td><button onClick={() => handleDeleteBook(b)}>delete</button></td>
                  : <td></td>
              }
            </tr>
          ))
          }
        </tbody>
      </table>
      {
        genres
          ?
          <div>
            filter by genre: {' '}
            {
              <select
                value={selectedGenre} onChange={(e) => filterByGenre(e)}
              >
                <option value={''}>all</option>
                {
                  genres.map(g =>
                    <option key={g} value={g}>{g}</option>
                  )
                }
              </select>
            }
          </div>
          : ""
      }
    </div>
  );
};

export default BooksByGenre;