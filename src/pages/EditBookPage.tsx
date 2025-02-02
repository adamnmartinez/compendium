import { AppHeader,Book } from "../App";

export default function EditBookPage(props: {
  book: Book;
  toLibrary: Function;
  editFunc: Function;
}) {
  async function awaitEdit(oldBook: Book, newBook: Book) {
    console.log(`EditBookPage: modifying book \"${oldBook.title}\"`);
    try {
      await props.editFunc(oldBook, newBook);
    } catch {
      `EditBookPage: An error occured in awaitPush while modifying ${oldBook.title}`;
    }
    console.log(
      `EditBookPage: successfully modified \"${oldBook.title}\" to \"${newBook.title}\"`,
    );
  }

  return (
    <div className="editBookPage">
      <AppHeader></AppHeader>
      <br />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const updatedEntry = new Book(
            event.currentTarget.bookTitle.value,
            event.currentTarget.author.value,
            event.currentTarget.year.value,
            event.currentTarget.pages.value,
            event.currentTarget.edition.value,
            props.book.uuid,
          );
          updatedEntry.notes = props.book.notes;
          awaitEdit(props.book, updatedEntry);
          props.toLibrary();
        }}
      >
        <p>Title *</p>
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
