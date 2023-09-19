import { Book } from "../components/App";

export default function AddBookPage(props: {
  pushFunc: Function;
  toLibrary: Function;
}) {
  return (
    <div className="addBookPage">
      <header>Compendium</header>
      <br />
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
        <p>Title</p>
        <input name="bookTitle" type="text" required></input>
        <br />
        <p>Author(s)</p>
        <input name="author" type="text"></input>
        <br />
        <p>Year Published</p>
        <input name="year" type="number"></input>
        <br />
        <p>Pages</p>
        <input name="pages" type="number"></input>
        <br />
        <p>Edition Number/Title</p>
        <input name="edition" type="text"></input>
        <br />
        <div className="flexbuttons">
          <button className="submitBtn" type="submit">
            Submit Entry
          </button>
          <button className="cancelBtn" onClick={() => props.toLibrary()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
