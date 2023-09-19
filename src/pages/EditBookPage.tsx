import { Book } from "../components/App";

export default function EditBookPage(props: {
  book: Book;
  toLibrary: Function;
}) {
  return (
    <div className="editBookPage">
      <header>Compendium</header>
      <br />
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
        <p>Title</p>
        <input
          name="bookTitle"
          type="text"
          defaultValue={props.book.title}
          placeholder="Title"
          required
        ></input>
        <br />
        <p>Author(s)</p>
        <input
          name="author"
          type="text"
          placeholder="Author"
          defaultValue={props.book.author}
        ></input>
        <br />
        <p>Year Published</p>
        <input
          name="year"
          type="number"
          placeholder="Year Published"
          defaultValue={props.book.publishedYear}
        ></input>
        <br />
        <p>Pages</p>
        <input
          name="pages"
          type="number"
          placeholder="Pages"
          defaultValue={props.book.pages}
        ></input>
        <br />
        <p>Edition Number/Title</p>
        <input
          name="edition"
          type="text"
          placeholder="Edition Name/Number"
          defaultValue={props.book.edition}
        ></input>
        <br />
        <div className="flexbuttons">
          <button className="submitBtn" type="submit">
            Save Changes
          </button>
          <button className="cancelBtn" onClick={() => props.toLibrary()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
