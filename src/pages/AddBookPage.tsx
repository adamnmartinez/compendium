import { Book } from "../components/App";

export default function AddBookPage(props: {
  pushFunc: Function;
  toLibrary: Function;
}) {
  return (
    <>
      Add Book Page <br />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const newBook = new Book(
            event.currentTarget.bookTitle.value,
            event.currentTarget.author.value,
            event.currentTarget.year.value,
            event.currentTarget.pages.value,
          );
          props.pushFunc(newBook);
        }}
      >
        <input
          name="bookTitle"
          type="bookTitle"
          placeholder="Title"
          required
        ></input>
        <input name="author" type="author" placeholder="Author"></input>
        <input name="year" type="year" placeholder="Year Published"></input>
        <input name="pages" type="pages" placeholder="Pages"></input>
        <button type="submit">Add Book</button>
        <button onClick={() => props.toLibrary()}>Cancel</button>
      </form>
    </>
  );
}
