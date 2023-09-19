import { Book } from "./App";
import { Note } from "./App";

export default function NoteList(props: {
  deleteNote: Function;
  editNote: Function;
  book: Book;
  list: Note[];
}): React.ReactElement {
  const listElements: React.ReactElement[] = [];

  props.list.forEach((note) => {
    listElements.push(
      <li>
        <div>
          <div className="title">
            <b>{note.title ? note.title : ""}</b>
          </div>
          <div className="content">{note.content}</div>
          <div className="quote">
            <i>
              {note.quote ? '"' + note.quote + '"' : ""}{" "}
              {note.speaker
                ? ` - ${note.speaker} `
                : `${note.quote ? ` - ${props.book.author}` : ""}`}{" "}
            </i>
          </div>
          <div className="details">
            {note.chapter ? `Chapter ${note.chapter} ` : ""}{" "}
            {note.chapter ? <br /> : ""}
            {note.page ? `Page ${note.page} ` : ""} {note.page ? <br /> : ""}
            {note.speaker ? <br /> : ""}
          </div>
          <div className="notebuttons">
            <button
              className="editBtn"
              onClick={() => props.editNote(note, props.book)}
            >
              Edit
            </button>
            <button
              className="deleteBtn"
              onClick={() => props.deleteNote(note)}
            >
              Delete
            </button>
          </div>
        </div>
      </li>,
    );
  });

  return <ul className="noteList">{listElements}</ul>;
}
