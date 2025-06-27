import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

export default function Books() {
  const { loading, data } = useQuery(ALL_BOOKS)

  if (loading) return <div>Loading books...</div>
  if (!data) return <div>No data available</div>

  return (
    <div>
      <h2>Books</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th><th>Author</th><th>Published</th>
          </tr>
        </thead>
        <tbody>
          {data.allBooks.map(b => (
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
