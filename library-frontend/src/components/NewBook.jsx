import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

export default function NewBook() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genreInput, setGenreInput] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
  })

  const submit = async (e) => {
    e.preventDefault()
    addBook({
      variables: {
        title, author,
        published: Number(published),
        genres,
      },
    })
    setTitle(''); setAuthor(''); setPublished('')
    setGenres([]); setGenreInput('')
  }

  return (
    <div>
      <h2>Add New Book</h2>
      <form onSubmit={submit}>
        <div>Title: <input value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div>Author: <input value={author} onChange={e => setAuthor(e.target.value)} /></div>
        <div>Published: <input type="number" value={published} onChange={e => setPublished(e.target.value)} /></div>
        <div>
          Genre: <input value={genreInput} onChange={e => setGenreInput(e.target.value)} />
          <button type="button" onClick={() => { setGenres(genres.concat(genreInput)); setGenreInput('') }}>Add Genre</button>
        </div>
        <div>Genres: {genres.join(', ')}</div>
        <button type="submit">Create Book</button>
      </form>
    </div>
  )
}
