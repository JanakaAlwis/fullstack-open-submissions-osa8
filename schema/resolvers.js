const Author = require('../models/author')
const Book = require('../models/book')
const User = require('../models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey'

const resolvers = {
  Query: {
    allBooks: async (root, args) => {
      let filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        filter.author = author._id
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }

      return Book.find(filter).populate('author')
    },

    allAuthors: () => Author.find({}),

    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id })
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }

      try {
        let author = await Author.findOne({ name: args.author })
        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        }

        const book = new Book({ ...args, author: author._id })
        await book.save()
        return book.populate('author')
      } catch (error) {
        throw new GraphQLError('Saving book failed: ' + error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error,
          }
        })
      }
    },

    createUser: async (root, args) => {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash('secret', saltRounds) // simple default password "secret"

      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
        passwordHash
      })

      try {
        await user.save()
        return user
      } catch (error) {
        throw new GraphQLError('Creating user failed: ' + error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          }
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(args.password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        throw new GraphQLError('Invalid username or password', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  }
}

module.exports = resolvers
