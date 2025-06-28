import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

export default function LoginForm({ setToken }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.error(error.graphQLErrors[0]?.message || 'Login failed')
    },
  })

  const submit = async (event) => {
    event.preventDefault()
    const { data } = await login({ variables: { username, password } })
    if (data?.login?.value) {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }

  return (
    <form onSubmit={submit}>
      <div>
        username <input value={username} onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
  )
}
