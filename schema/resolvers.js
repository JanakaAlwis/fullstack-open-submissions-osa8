const { PubSub, GraphQLError } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Author = require('../models/author')
const Book = require('../models/book')

const resolvers = {
  Query: {
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate('author')
      }

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        if (args.genre) {
          return Book.find({
            author: author._id,
            genres: { $in: [args.genre] }
          }).populate('author')
        }
        return Book.find({ author: author._id }).populate('author')
      }

      if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate('author')
      }
    },

    allAuthors: async () => {
      return Author.find({})
    },

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
        const populatedBook = await book.populate('author')

        pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })

        return populatedBook
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
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return user.save()
    },

    login: async (root, args) => {
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers
