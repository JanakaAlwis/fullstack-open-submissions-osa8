import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

export default function Books() {
  const { loading, data } = useQuery(ALL_BOOKS)
  const [selectedGenre, setSelectedGenre] = useState(null)

  if (loading) return <div>Loading books...</div>
  if (!data) return <div>No data available</div>

  const books = data.allBooks

  // extract unique genres
  const genres = [...new Set(books.flatMap(book => book.genres))]

  // filter books by selectedGenre
  const filteredBooks = selectedGenre
    ? books.filter(book => book.genres.includes(selectedGenre))
    : books

  return (
    <div>
      <h2>Books</h2>
      {selectedGenre && <p>in genre <strong>{selectedGenre}</strong></p>}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
            <th>Genres</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
              <td>{b.genres.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        {genres.map(g => (
          <button key={g} onClick={() => setSelectedGenre(g)}>{g}</button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  )
}
