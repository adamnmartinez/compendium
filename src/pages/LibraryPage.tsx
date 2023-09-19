import BookList from "../components/BookList";
import { Book } from "../components/App";

export default function LibraryPage(props: {
  pullFunc: Function;
  lib: Book[];
  addBook: Function;
  editBook: Function;
  bookNotes: Function;
}) {
  return (
    <div className="libraryPage">
      <header>Compendium</header> <br />
      <button className="addBookBtn" onClick={() => props.addBook()}>
        New Entry +
      </button>
      <BookList
        deleteFunc={props.pullFunc}
        editFunc={props.editBook}
        notesFunc={props.bookNotes}
        list={props.lib}
      />
    </div>
  );
}
