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
        <div className="bookWrapper">
          <span className="bookName">
            {book.title}
            {book.publishedYear ? ` (${book.publishedYear})` : ""}{" "}
          </span>
          <hr />
          by {book.author ? book.author : "Unknown"} <br />
          {book.pages ? `${book.pages} pages ` : ""} {book.pages ? <br /> : ""}
          {book.edition ? `Edition ${book.edition} ` : ""}{" "}
          {book.edition ? <br /> : ""}
          <div className="bookButtons">
            <button
              className="bookOperations"
              onClick={() => props.editFunc(book)}
            >
              Edit
            </button>
            <button
              className="bookOperations"
              onClick={() => props.notesFunc(book)}
            >
              Notes
            </button>
            <button
              className="bookOperations deleteBtn"
              onClick={() => props.deleteFunc(book)}
            >
              Delete
            </button>
          </div>
        </div>
      </li>,
    );
  });

  return <ul className="bookList">{listElements}</ul>;
}
