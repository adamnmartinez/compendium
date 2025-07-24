import { Book } from "../utilities/Interface";

export default function BookList(props: {
  deleteFunc: Function;
  editFunc: Function;
  notesFunc: Function;
  list: Book[];
  query: string;
}): React.ReactElement {
  const listElements: React.ReactElement[] = [];

  const noResults = <li className="noresults">No Results</li>;

  for (let i = 0; i < props.list.length; i++) {
    let book = props.list[i]

    if (
      book.title.toLowerCase().includes(props.query.toLowerCase()) ||
      book.author.toLowerCase().includes(props.query.toLowerCase()) ||
      props.query === ""
    ) {
      listElements.push(
        <li key={i}>
          <div className="bookWrapper">
            <span className="bookName">
              {book.title}
              {book.publishedYear ? ` (${book.publishedYear})` : ""}{" "}
              {book.edition ? ` - ${book.edition}` : ""}{" "}
            </span>
            <hr />
            by {book.author ? book.author : "Unknown"} <br />
            {book.pages ? `${book.pages} pages ` : ""}{" "}
            {book.pages ? <br /> : ""}
            

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
    }
  }

  return (
    <ul className="bookList">
      {listElements.length !== 0
        ? listElements
        : props.query === ""
        ? ""
        : noResults}
    </ul>
  );
}
