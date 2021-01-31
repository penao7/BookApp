import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, BOOK_DELETED } from './queries.js';
import { useSubscription, useApolloClient } from '@apollo/client';

const client = useApolloClient();

export const updateCacheWith = async (addedBook) => {

  const includedIn = (set, object) => {
    return set.some(b => b.id === object.id);
  };

  const dataInStore = await client.readQuery({ query: ALL_BOOKS });
  const testStore = await client.readQuery({ query: ALL_AUTHORS })

  if (addedBook) {

    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data:
          { allBooks: dataInStore.allBooks.concat(addedBook) }
      });
    };

    if (!includedIn(testStore.allAuthors, addedBook.author)) {
      client.writeQuery({
        query: ALL_AUTHORS,
        data:
          { allAuthors: testStore.allAuthors.concat(addedBook.author) }
      })
    };
  };
};

export const bookAddSub = useSubscription(BOOK_ADDED, {
  onSubscriptionData: ({ subscriptionData }) => {
    const addedBook = subscriptionData.data.bookAdded;
    updateCacheWith(addedBook);
  }
});

export const bookDelSub = useSubscription(BOOK_DELETED, {
  onSubscriptionData: async ({ subscriptionData }) => {
    const includedIn = (set, object) => {
      return set.some(b => b.id === object.id);
    };

    const deletedBook = subscriptionData.data.bookDeleted;
    const dataInStore = await client.readQuery({ query: ALL_BOOKS });

    if (includedIn(dataInStore.allBooks, deletedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data:
          { allBooks: dataInStore.allBooks.filter(b => b.id !== deletedBook.id) }
      });
    };
  }
});