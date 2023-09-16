import BookList from "../components/BookList";
import { Book } from "../components/App";

export default function LibraryPage(props: {
  pullFunc: Function;
  lib: Book[];
  addBook: Function;
  editBook: Function;
}) {
  return (
    <>
      Library Page <br />
      <button onClick={() => props.addBook()}>Add Book</button>
      <BookList
        deleteFunc={props.pullFunc}
        list={props.lib}
        editFunc={props.editBook}
      />
    </>
  );
}
