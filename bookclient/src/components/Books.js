import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';
import {
  FIND_BOOK,
  GET_GENRES,
  GET_BOOKS_BY_GENRE,
  DELETE_BOOK,
  GET_USER,
  ALL_BOOKS
} from '../queries';
import Book from './Book';
import BooksByGenre from './BooksByGenre';
import AllBooks from './AllBooks'

const Books = ({ show, setMessage, logout }) => {

  const [getBook, singleBookResult] = useLazyQuery(FIND_BOOK);
  const [getBooksByGenre, booksByGenreResult] = useLazyQuery(GET_BOOKS_BY_GENRE, {
    fetchPolicy: 'network-only'
  });

  const user = useQuery(GET_USER, {
    fetchPolicy: 'cache-first',
    onError: (err) => {
      if (err.graphQLErrors[0].extensions.code === 'UNAUTHENTICATED') {
        logout();
        setMessage(err.graphQLErrors[0].message);
      }
    }
  });
  const [book, setBook] = useState(null);
  const [genres, setGenres] = useState([]);
  const [genreBooks, setGenreBooks] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const { data, loading, fetchMore } = useQuery(ALL_BOOKS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      if (error.graphQLErrors[0]) {
        setMessage(error.graphQLErrors[0].message);
      };
    }
  });

  const genreList = useQuery(GET_GENRES, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setGenres(genreList.data.getGenres)
    }
  });

  const [deleteBook] = useMutation(DELETE_BOOK, {
    onError: (error) => {
      setMessage(error.graphQLErrors[0].error);
    },
    onCompleted: () => {
      genreList.refetch();
    }
  });

  const showBook = (id) => {
    getBook({ variables: { id: id } })
  };

  useEffect(() => {
    if (!singleBookResult.loading && singleBookResult.called) {
      setBook(singleBookResult.data.getBookById)
    };
  }, [singleBookResult])

  useEffect(() => {
    if (!booksByGenreResult.loading && booksByGenreResult.called && booksByGenreResult.data) {
      setGenreBooks(booksByGenreResult.data.allBooks.docs)
    };
  }, [booksByGenreResult])

  const filterByGenre = async (event) => {
    event.preventDefault();
    const genre = event.target.value;
    if (genre === '') {
      return setSelectedGenre('')
    };
    setSelectedGenre(genre)
    getBooksByGenre({ variables: { genre } })
  };

  const handleDeleteBook = (book) => {
    if (window.confirm(`are you sure you want to delete book '${book.title}'?`)) {
      deleteBook({ variables: { id: book.id } })
    };
  };

  const setOffset = (length) => {
    if (length < 10) {
      return 0
    };
    return length
  };

  const nextPage = () => {
    return fetchMore({
      variables: { offset: data.allBooks.docs.length },
      updateQuery: (prev, { fetchMoreResult }) => {
        const newValues = fetchMoreResult.allBooks.docs.filter(n => {
          return !(prev.allBooks.docs.some(b => b.id === n.id));
        });
        return Object.assign([], prev, {
          allBooks: { ...fetchMoreResult.allBooks, docs: [...newValues] }
        })
      }
    })
  };

  const previousPage = () => {
    return fetchMore({
      variables: { offset: setOffset(data.allBooks.docs.length - 10) },
      updateQuery: (prev, { fetchMoreResult }) => {
        const newValues = fetchMoreResult.allBooks.docs.filter(n => {
          return !(prev.allBooks.docs.some(b => b.id === n.id));
        });
        return Object.assign([], prev, {
          allBooks: { ...fetchMoreResult.allBooks, docs: [...newValues] }
        })
      }
    })
  };

  if (!show) {
    return ''
  };

  if (loading || genreList.loading || !data) {
    return <div>Loading . . .</div>
  };

  if (book) {
    return (
      <Book book={book} setBook={setBook} />
    );
  };

  if (genreBooks && selectedGenre !== '') {
    return (
      <BooksByGenre
        selectedGenre={selectedGenre}
        filterByGenre={filterByGenre}
        handleDeleteBook={handleDeleteBook}
        genreBooks={genreBooks}
        showBook={showBook}
        user={user}
        genres={genres}
      />
    )
  }

  return (
    data ?
      <AllBooks
        data={data}
        previousPage={previousPage}
        nextPage={nextPage}
        showBook={showBook}
        user={user}
        selectedGenre={selectedGenre}
        genres={genres}
        handleDeleteBook={handleDeleteBook}
        filterByGenre={filterByGenre}
      />
      : ""
  )
};

export default Books;