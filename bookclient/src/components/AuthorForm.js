import React, { useState, useEffect } from 'react';
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries';
import { useMutation } from '@apollo/client';
import Select from 'react-select';

const AuthorForm = ({ authors, setMessage, logout }) => {

  const [year, setYear] = useState('');
  const [name, setName] = useState('');


  const [changeYear, result] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      if (error.graphQLErrors[0].extensions.code === 'UNAUTHENTICATED') {
        setMessage(error.graphQLErrors[0].message)
        return logout();
      };
      setMessage(error.graphQLErrors[0].message);
    },
    refetchQueries: [{ query: ALL_AUTHORS }]
  });

  const submit = async (event) => {
    event.preventDefault();

    const setBornTo = Number(year);

    changeYear({ variables: { name, setBornTo } })
  }

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setMessage('author not found')
    }
  }, [result.data]); // eslint-disable-line

  if (authors.loading) {
    return <div>Loading . . . </div>
  }

  const options = authors.data.allAuthors.map(a => { return { value: a.name, label: a.name } });

  return (
    <div>
      <h2> Set birthyear </h2>
      <form onSubmit={submit}>
        <Select
          onChange={(e) => setName(e.value)}
          isSearchable
          options={options}
        />
        <div>
          year <input value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type="submit" >set</button>
      </form>
    </div>
  )
};

export default AuthorForm;