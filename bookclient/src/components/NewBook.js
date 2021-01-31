import React, { useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CREATE_BOOK, GET_GENRES } from '../queries';


const NewBook = ({ show, setMessage, updateCacheWith, logout }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [year, setYear] = useState('')
  const [genres, setGenres] = useState([])
  const [genreInput, setGenreInput] = useState('');
  const [getGenres] = useLazyQuery(GET_GENRES, {
    fetchPolicy: 'network-only',
  });

  const [createBook] = useMutation(CREATE_BOOK, {
    notifyOnNetworkStatusChange: 'true',
    onError: (error) => {
      if (error.graphQLErrors[0].extensions.code === 'UNAUTHENTICATED') {
        setMessage(error.graphQLErrors[0].message)
        return logout();
      };
      setMessage(error.graphQLErrors[0].message)
    },
    update: (store, response) => {
      updateCacheWith(response.data.addBook)
    },
    onCompleted: () => {
      getGenres()
    }
  });

  if (!show) {
    return ''
  };

  const submit = async (event) => {
    event.preventDefault();

    const published = Number(year);

    if (isNaN(published)) {
      return setMessage('published is not a number')
    };

    createBook({ variables: { title, author, published, genres } });

    setTitle('');
    setAuthor('');
    setYear('');
    setGenres([]);
  };

  const addGenre = (e) => {
    e.preventDefault();
    setGenres(genres.concat(genreInput));
  };

  return (
    <div>
      <h2>New book</h2>
      <form onSubmit={submit}>
        <div>
          title <input value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author <input value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published <input value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <div>
          <input onChange={({ target }) => setGenreInput(target.value)} />
          <button onClick={(e) => addGenre(e)}>add</button>
          <div>genres: {genres.join(", ")}</div>
        </div>
        <button type='submit'>add!</button>
      </form>
    </div>
  )
}

export default NewBook;