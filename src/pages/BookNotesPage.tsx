import { Book } from "../components/App";
import { Note } from "../components/App";
import NoteList from "../components/NoteList";

export default function BookNotesPage(props: {
  book: Book;
  toLibrary: Function;
  editNote: Function;
  renderNotesPage: Function;
}) {
  function deleteNote(note: Note): void {
    const newArr = [...props.book.notes];
    const index = newArr.indexOf(note);
    newArr.splice(index, 1);
    props.book.notes = newArr;
    props.renderNotesPage(props.book);
  }

  return (
    <>
      <i>{props.book.title}</i>
      {props.book.publishedYear ? ` (${props.book.publishedYear})` : ""} <br />
      by {props.book.author ? props.book.author : "Unknown"} <br />
      {props.book.pages ? `${props.book.pages} pages` : ""}{" "}
      {props.book.pages ? <br /> : ""}
      {props.book.edition ? `Edition ${props.book.edition}` : ""}{" "}
      {props.book.edition ? <br /> : ""}
      <br />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const newNote = new Note(
            event.currentTarget.noteTitle.value,
            event.currentTarget.content.value,
            event.currentTarget.quote.value,
            event.currentTarget.chapter.value,
            event.currentTarget.page.value,
            event.currentTarget.speaker.value,
          );
          props.book.notes.push(newNote);
          console.log(props.book.notes);
          props.renderNotesPage(props.book);
        }}
      >
        <input name="noteTitle" placeholder="Note Title"></input>
        <br />
        <textarea
          name="content"
          placeholder="Your ideas here."
          required
        ></textarea>
        <br />
        <textarea name="quote" placeholder="Relevant quote(s) here."></textarea>
        <br />
        <input name="chapter" placeholder="Chapter Title/Number"></input>
        <input name="page" placeholder="Page Number"></input>
        <input name="speaker" placeholder="Speaker"></input>
        <br />
        <button type="submit">Save</button>
        <button type="reset">Reset</button>
      </form>
      <button onClick={() => props.toLibrary()}>Back to Library</button>
      <hr />
      Notes
      <hr />
      <NoteList
        book={props.book}
        list={props.book.notes}
        deleteNote={deleteNote}
        editNote={props.editNote}
      />
    </>
  );
}
