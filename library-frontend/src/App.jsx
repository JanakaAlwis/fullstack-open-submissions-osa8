import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import SetBirthYear from "./components/SetBirthYear"

const App = () => {
  const [page, setPage] = useState("authors")

  let content
  if (page === "authors") content = <Authors />
  else if (page === "books") content = <Books />
  else if (page === "add") content = <NewBook />
  else if (page === "setBirthYear") content = <SetBirthYear />

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("setBirthYear")}>set birthyear</button>
      </div>
      {content}
    </div>
  )
}

export default App
