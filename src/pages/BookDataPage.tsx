import { Book } from "../components/App";

export default function BookDataPage(props: {
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
          props.toLibrary();
        }}
      >
        <input
          name="bookTitle"
          type="bookTitle"
          defaultValue={props.book.title}
          required
        ></input>
        <input
          name="author"
          type="author"
          defaultValue={props.book.author}
        ></input>
        <input
          name="year"
          type="year"
          defaultValue={props.book.publishedYear}
        ></input>
        <input
          name="pages"
          type="pages"
          defaultValue={props.book.pages}
        ></input>
        <button type="submit">Save</button>
        <button onClick={() => props.toLibrary()}>Cancel</button>
      </form>
    </>
  );
}
