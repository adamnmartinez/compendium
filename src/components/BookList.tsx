import { Book } from "./App";

export default function BookList(props: {
  deleteFunc: Function;
  editFunc: Function;
  notesFunc: Function;
  list: Book[];
}): React.ReactElement {
  const listElements: React.ReactElement[] = [];

  props.list.forEach((book) => {
    listElements.push(
      <li>
        <div>
          <i>{book.title}</i>
          {book.publishedYear ? ` (${book.publishedYear})` : ""}, by{" "}
          {book.author ? book.author : "Unknown"}.{" "}
          {book.pages ? `${book.pages} pages. ` : ""}{" "}
          {book.edition ? `Edition ${book.edition}. ` : ""}
          <button onClick={() => props.editFunc(book)}>Edit</button>
          <button onClick={() => props.notesFunc(book)}>Notes</button>
          <button onClick={() => props.deleteFunc(book)}>Delete</button>
        </div>
      </li>,
    );
  });

  return <ul>{listElements}</ul>;
}
