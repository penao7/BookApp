import React from 'react';
import { useQuery } from '@apollo/client';
import { ALL_AUTHORS } from '../queries';
import AuthorForm from './AuthorForm';

const Authors = ({ show, setMessage, token, logout }) => {

  const authors = useQuery(ALL_AUTHORS);

  if (!show) {
    return ''
  };

  if (!authors.data || authors.loading) {
    return <div>Loading . . .</div>
  };

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
        </thead>
        <tbody>
          {
            authors.data.allAuthors.map(a => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      {
        token
         ? 
            <AuthorForm 
              authors={authors} 
              setMessage={setMessage}
              logout={logout}
            />
         : ""
      }
      
    </div>
  );

};

export default Authors;