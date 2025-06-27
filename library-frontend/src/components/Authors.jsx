import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'

export default function Authors() {
  const { loading, data } = useQuery(ALL_AUTHORS)
  if (loading) return <div>Loading authors...</div>

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <thead><tr><th>Name</th><th>Born</th><th>Books</th></tr></thead>
        <tbody>
          {data.allAuthors.map(a => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born || '—'}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

