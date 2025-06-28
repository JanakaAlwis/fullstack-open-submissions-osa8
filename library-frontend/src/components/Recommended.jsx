import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

export default function Recommended() {
  const { data: meData, loading: meLoading } = useQuery(ME)
  const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS)

  if (meLoading || booksLoading) return <div>Loading recommendations...</div>
  if (!meData || !booksData) return <div>Error loading data.</div>

  const favoriteGenre = meData.me.favoriteGenre
  const books = booksData.allBooks.filter(b => b.genres.includes(favoriteGenre))

  return (
    <div>
      <h2>Recommendations</h2>
      <p>Books in your favorite genre <strong>{favoriteGenre}</strong>:</p>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
