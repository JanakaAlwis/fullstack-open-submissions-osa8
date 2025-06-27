import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries';

const NewBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      console.error(error.graphQLErrors[0]?.message);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    await addBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres,
      },
    });

    setTitle('');
    setAuthor('');
    setPublished('');
    setGenres([]);
    setGenreInput('');
  };

  const addGenre = () => {
    if (genreInput.trim() !== '') {
      setGenres(genres.concat(genreInput.trim()));
      setGenreInput('');
    }
  };

  return (
    <div>
      <h2>Add new book</h2>
      <form onSubmit={submit}>
        <div>
          Title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            required
          />
        </div>
        <div>
          Author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            required
          />
        </div>
        <div>
          Published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
            required
          />
        </div>
        <div>
          <input
            value={genreInput}
            onChange={({ target }) => setGenreInput(target.value)}
          />
          <button type="button" onClick={addGenre}>Add genre</button>
        </div>
        <div>Genres: {genres.join(', ')}</div>
        <button type="submit">Create book</button>
      </form>
    </div>
  );
};

export default NewBook;
