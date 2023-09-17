import { Book } from "../components/App";

export default function EditBookPage(props: {
  book: Book;
  toLibrary: Function;
}) {
  return (
    <>
      Edit Book Page
      <form
        onSubmit={(event) => {
          event.preventDefault();
          props.book.title = event.currentTarget.bookTitle.value;
          props.book.author = event.currentTarget.author.value;
          props.book.publishedYear = event.currentTarget.year.value;
          props.book.pages = event.currentTarget.pages.value;
          props.book.edition = event.currentTarget.edition.value;
          props.toLibrary();
        }}
      >
        <input
          name="bookTitle"
          type="text"
          defaultValue={props.book.title}
          placeholder="Title"
          required
        ></input>
        <input
          name="author"
          type="text"
          placeholder="Author"
          defaultValue={props.book.author}
        ></input>
        <input
          name="year"
          type="number"
          placeholder="Year Published"
          defaultValue={props.book.publishedYear}
        ></input>
        <input
          name="pages"
          type="number"
          placeholder="Pages"
          defaultValue={props.book.pages}
        ></input>
        <input
          name="edition"
          type="text"
          placeholder="Edition Name/Number"
          defaultValue={props.book.edition}
        ></input>
        <button type="submit">Save</button>
        <button onClick={() => props.toLibrary()}>Cancel</button>
      </form>
    </>
  );
}
