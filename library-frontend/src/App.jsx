import { useState, useEffect } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import SetBirthYear from "./components/SetBirthYear"
import LoginForm from "./components/LoginForm"
import Recommended from './components/Recommended'

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token')
    if (savedToken) setToken(savedToken)
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    setPage("authors")
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("setBirthYear")}>set birthyear</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        )}
        {!token && <button onClick={() => setPage("login")}>login</button>}
      </div>

      {page === "authors" && <Authors />}
      {page === "books" && <Books />}
      {page === "add" && token && <NewBook />}
      {page === "setBirthYear" && token && <SetBirthYear />}
      {page === "recommend" && token && <Recommended />}
      {page === "login" && !token && <LoginForm setToken={setToken} />}
    </div>
  )
}

export default App
