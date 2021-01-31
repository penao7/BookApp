import React from 'react';

const AllBooks = ({
  data,
  previousPage,
  nextPage,
  showBook,
  user,
  selectedGenre,
  genres,
  handleDeleteBook,
  filterByGenre
}) => {

  return (
    <div>
      <h2>All books</h2>
      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.allBooks.docs.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
              <td><button onClick={() => showBook(b.id)}>show</button></td>
              {
                (user.called, !user.loading && user.data && user.data.me && user.data.me.role === 'ADMIN')
                  ? <td><button onClick={() => handleDeleteBook(b)}>delete</button></td>
                  : <td></td>
              }
            </tr>
          ))
          }
        </tbody>
      </table>
      <button disabled={data.allBooks.pageInfo.prevPage === null ? true : false} onClick={previousPage}>previous</button>
      <button disabled={data.allBooks.pageInfo.nextPage === null ? true : false} onClick={nextPage}>next page</button>
      {
        genres
          ?
          <div>
            filter by genre: {' '}
            {
              <select
                value={selectedGenre} onChange={(e) => filterByGenre(e)}
              >
                <option value={null}>all</option>
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

export default AllBooks;
