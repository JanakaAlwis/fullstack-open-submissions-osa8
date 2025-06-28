require('dotenv').config()
const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const typeDefs = require('./schema/typeDefs')
const resolvers = require('./schema/resolvers')
const User = require('./models/user')

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey'

console.log('Connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.error('Error connection to MongoDB:', error.message)
  })

const app = express()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const token = auth.substring(7)
      try {
        const decodedToken = jwt.verify(token, JWT_SECRET)
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      } catch {
        // invalid token
        return {}
      }
    }
    return {}
  }
})

async function start() {
  await server.start()
  server.applyMiddleware({ app })

  const PORT = process.env.PORT || 4000
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`)
  })
}

start()
