import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  split,
  gql,
  useSubscription
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import App from './App'
import { ALL_BOOKS } from './queries' 

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
})

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
})

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      id
      title
      author {
        name
      }
      published
      genres
    }
  }
`

function updateCache(cache, query, addedBook) {
  const uniqueByTitle = (books) => {
    const seen = new Set()
    return books.filter(b => {
      if (seen.has(b.title)) return false
      seen.add(b.title)
      return true
    })
  }

  const dataInCache = cache.readQuery({ query })
  if (!dataInCache) return

  if (!dataInCache.allBooks.find(b => b.id === addedBook.id)) {
    cache.writeQuery({
      query,
      data: {
        ...dataInCache,
        allBooks: uniqueByTitle(dataInCache.allBooks.concat(addedBook))
      }
    })
  }
}

function SubscriptionHandler() {
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded

      alert(`New book added: "${addedBook.title}" by ${addedBook.author.name}`)

      updateCache(client.cache, ALL_BOOKS, addedBook)
    }
  })

  return null
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <SubscriptionHandler />
    <App />
  </ApolloProvider>
)
