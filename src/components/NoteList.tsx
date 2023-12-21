import { Book } from "./App";
import { Note } from "./App";

export default function NoteList(props: {
  deleteNote: Function;
  editNote: Function;
  renderNoteList: Function;
  book: Book;
  list: Note[];
  query: string;
}): React.ReactElement {
  const listElements: React.ReactElement[] = [];

  props.list.forEach((note) => {
    if (
      note.title.toLowerCase().includes(props.query.toLowerCase()) ||
      note.content.toLowerCase().includes(props.query.toLowerCase()) ||
      note.quote.toLowerCase().includes(props.query.toLowerCase()) ||
      note.speaker.toLowerCase().includes(props.query.toLowerCase()) ||
      props.query === ""
    ) {
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
                {note.speaker ? ` - ${note.speaker} ` : ""}{" "}
              </i>
            </div>
            <div className="details">
              {note.chapter ? `${note.chapter} ` : ""}{" "}
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
                onClick={() => {
                  props.deleteNote(props.book, note);
                  setTimeout(() => props.renderNoteList(), 500);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </li>,
      );
    }
  });

  return <ul className="noteList">{listElements}</ul>;
}
