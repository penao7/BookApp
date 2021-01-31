import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_USERLIST, GET_USER } from '../queries'
import { useApolloClient } from '@apollo/client';

const UserList = ({ show }) => {

  const client = useApolloClient();
  const [getUserList, result] = useLazyQuery(GET_USERLIST);
  const user = client.readQuery({ query: GET_USER });

  useEffect(() => {
    if (user && user.me && user.me.role === 'ADMIN') {
      getUserList();
    };
  }, [user]);

  if (!show) {
    return ''
  };

  return (
    (result.data && user && user.me && user.me.role === 'ADMIN')
      ?
      <div>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>username</th>
              <th>favorite genre</th>
              <th>role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {result.data.allUsers.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.favoriteGenre}</td>
                <td>{u.role}</td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
      : ""

  );




};

export default UserList;