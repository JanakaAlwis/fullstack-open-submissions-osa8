const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v4: uuid } = require('uuid')

let authors = [
  { name: 'Robert Martin', id: "afa51ab0-344d-11e9-a414-719c6709cf3e", born: 1952 },
  { name: 'Martin Fowler', id: "afa5b6f0-344d-11e9-a414-719c6709cf3e", born: 1963 },
  { name: 'Fyodor Dostoevsky', id: "afa5b6f1-344d-11e9-a414-719c6709cf3e", born: 1821 },
  { name: 'Joshua Kerievsky', id: "afa5b6f2-344d-11e9-a414-719c6709cf3e" },
  { name: 'Sandi Metz', id: "afa5b6f3-344d-11e9-a414-719c6709cf3e" },
]

let books = [
  { title: 'Clean Code', published: 2008, author: 'Robert Martin', id: uuid(), genres: ['refactoring'] },
  { title: 'Agile software development', published: 2002, author: 'Robert Martin', id: uuid(), genres: ['agile', 'patterns', 'design'] },
  { title: 'Refactoring, edition 2', published: 2018, author: 'Martin Fowler', id: uuid(), genres: ['refactoring'] },
  { title: 'Refactoring to patterns', published: 2008, author: 'Joshua Kerievsky', id: uuid(), genres: ['refactoring', 'patterns'] },
  { title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby', published: 2012, author: 'Sandi Metz', id: uuid(), genres: ['refactoring', 'design'] },
  { title: 'Crime and punishment', published: 1866, author: 'Fyodor Dostoevsky', id: uuid(), genres: ['classic', 'crime'] },
  { title: 'Demons', published: 1872, author: 'Fyodor Dostoevsky', id: uuid(), genres: ['classic', 'revolution'] },
]

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: String!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      let filtered = books
      if (args.author) {
        filtered = filtered.filter(b => b.author === args.author)
      }
      if (args.genre) {
        filtered = filtered.filter(b => b.genres.includes(args.genre))
      }
      return filtered
    },
    allAuthors: () => {
      return authors.map(author => ({
        ...author,
        bookCount: books.filter(b => b.author === author.name).length
      }))
    },
  },

  Mutation: {
    addBook: (root, args) => {
      let authorExists = authors.find(a => a.name === args.author)
      if (!authorExists) {
        const newAuthor = { name: args.author, id: uuid() }
        authors = authors.concat(newAuthor)
      }

      const newBook = { ...args, id: uuid() }
      books = books.concat(newBook)
      return newBook
    },

    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) return null

      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
