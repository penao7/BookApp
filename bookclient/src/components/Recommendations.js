import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER, GET_BOOKS_BY_GENRE } from '../queries';

const Recommendations = ({ show }) => {

  const [genre, setGenre] = useState('');

  const user = useQuery(GET_USER,
    {
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: 'true',
      onCompleted: () => {
        if (user.data.me !== null) {
          setGenre(user.data.me.favoriteGenre)
        }
      }
    }
  );

  const books = useQuery(GET_BOOKS_BY_GENRE, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: 'true',
    variables: { genre: genre }
  });

  if (!show) {
    return ''
  };

  return (
    (books.data.allBooks.docs) 
    ?
      <div>
        <h2>Recommendations</h2>
        <div>
          <p>recommendations given by your favorite genre <strong>{genre}</strong></p>
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
              {books.data.allBooks.docs.map(b => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{b.author.name}</td>
                  <td>{b.published}</td>
                </tr>
              ))
              }
            </tbody>
          </table>
        </div>
      </div>
      : ""
  );
}

export default Recommendations;