import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { BOOKS_BY_GENRE } from '../queries'

const genres = ['refactoring', 'agile', 'patterns', 'design', 'crime', 'classic', 'all']

export default function Books() {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const { loading, data } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: selectedGenre === 'all' ? null : selectedGenre },
  })

  if (loading) return <div>Loading books...</div>
  if (!data || !data.allBooks) return <div>No books found</div>

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
          {data.allBooks.map((b) => (
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
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={{
              marginRight: '0.5rem',
              background: selectedGenre === genre ? 'lightblue' : '',
            }}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}
