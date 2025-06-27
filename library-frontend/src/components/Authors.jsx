import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import SetBirthYear from './SetBirthYear'

export default function Authors() {
  const { loading, data } = useQuery(ALL_AUTHORS)

  if (loading) return <div>Loading authors...</div>

  const authors = data.allAuthors

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <thead><tr><th>Name</th><th>Born</th><th>Books</th></tr></thead>
        <tbody>
          {authors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born || '—'}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SetBirthYear authors={authors} />
    </div>
  )
}
