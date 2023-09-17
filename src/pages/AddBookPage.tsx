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
            event.currentTarget.edition.value,
          );
          props.pushFunc(newBook);
          props.toLibrary();
        }}
      >
        <input
          name="bookTitle"
          type="text"
          placeholder="Title"
          required
        ></input>
        <input name="author" type="text" placeholder="Author"></input>
        <input name="year" type="number" placeholder="Year Published"></input>
        <input name="pages" type="number" placeholder="Pages"></input>
        <input
          name="edition"
          type="text"
          placeholder="Edition Name/Number"
        ></input>
        <button type="submit">Add Book</button>
        <button onClick={() => props.toLibrary()}>Cancel</button>
      </form>
    </>
  );
}
