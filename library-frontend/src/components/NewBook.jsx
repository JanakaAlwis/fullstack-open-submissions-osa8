import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ADD_BOOK, BOOKS_BY_GENRE } from '../queries'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    update: (cache, { data: { addBook } }) => {
      const allGenres = [...addBook.genres, null] 

      allGenres.forEach((g) => {
        try {
          const existing = cache.readQuery({
            query: BOOKS_BY_GENRE,
            variables: { genre: g },
          })

          if (!existing.allBooks.find(b => b.id === addBook.id)) {
            cache.writeQuery({
              query: BOOKS_BY_GENRE,
              variables: { genre: g },
              data: {
                allBooks: [...existing.allBooks, addBook],
              },
            })
          }
        } catch (error) {
          // Ignore if no cache exists yet for this genre
        }
      })
    }
  })

  const submit = async (event) => {
    event.preventDefault()

    await addBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres,
      }
    })

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>Add a new book</h2>
      <form onSubmit={submit}>
        <div>
          title <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          published <input type="number" value={published} onChange={({ target }) => setPublished(target.value)} />
        </div>
        <div>
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button type="button" onClick={addGenre}>add genre</button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook