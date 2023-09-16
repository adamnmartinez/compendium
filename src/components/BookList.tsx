import { Book } from "./App";

export default function BookList(props: {
  deleteFunc: Function;
  list: Book[];
  editFunc: Function;
}): React.ReactElement {
  const listElements: React.ReactElement[] = [];

  props.list.forEach((book) => {
    listElements.push(
      <li>
        <div>
          {book.title} ({book.publishedYear ? book.publishedYear : "Unknown"}),
          by {book.author ? book.author : "Unknown"}.{" "}
          {book.pages ? `${book.pages} pages` : ""}
          <button onClick={() => props.deleteFunc(book)}>Delete Book</button>
          <button onClick={() => props.editFunc(book)}>Edit Book</button>
        </div>
      </li>,
    );
  });

  return <ul>{listElements}</ul>;
}
