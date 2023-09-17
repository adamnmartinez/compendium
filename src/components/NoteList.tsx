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
          <b>{note.title ? note.title : ""}</b> {note.title ? <br /> : ""}
          {note.content}
          <br />
          <i>{note.quote ? note.quote : ""}</i> {note.quote ? <br /> : ""}
          {note.chapter ? `Chapter ${note.chapter} ` : ""}{" "}
          {note.chapter ? <br /> : ""}
          {note.page ? `Page ${note.page} ` : ""} {note.page ? <br /> : ""}
          {note.speaker ? `Spoken by ${note.speaker} ` : ""}{" "}
          {note.speaker ? <br /> : ""}
          <button onClick={() => props.deleteNote(note)}>Delete</button>{" "}
          <button onClick={() => props.editNote(note, props.book)}>Edit</button>
        </div>
      </li>,
    );
  });

  return <ul>{listElements}</ul>;
}
