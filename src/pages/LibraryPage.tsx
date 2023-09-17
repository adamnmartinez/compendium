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
    <>
      Library Page <br />
      <button onClick={() => props.addBook()}>Add Book</button>
      <BookList
        deleteFunc={props.pullFunc}
        editFunc={props.editBook}
        notesFunc={props.bookNotes}
        list={props.lib}
      />
    </>
  );
}
