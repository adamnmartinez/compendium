import { Book } from "../components/App";
import { Note } from "../components/App";
import { ChangeEvent, useState } from "react";
import NoteList from "../components/NoteList";

export default function BookNotesPage(props: {
  book: Book;
  toLibrary: Function;
  editNote: Function;
  renderNotesPage: Function;
}) {
  const [formVis, setFormVis] = useState<Boolean>(false);
  const [noteQuery, setNoteQuery] = useState<string>("");

  function formToggle(): void {
    formVis ? setFormVis(false) : setFormVis(true);
  }

  function deleteNote(note: Note): void {
    const newArr = [...props.book.notes];
    const index = newArr.indexOf(note);
    newArr.splice(index, 1);
    props.book.notes = newArr;
    props.renderNotesPage(props.book);
  }

  function handleSearch(event: ChangeEvent): void {
    const target = event.currentTarget as HTMLInputElement;
    setNoteQuery(target.value);
  }

  return (
    <div className="bookNotesPage">
      <div className="bookInfo">
        <span className="bookTitle">
          <i>{props.book.title}</i>{" "}
          {props.book.publishedYear ? ` (${props.book.publishedYear})` : ""}
        </span>{" "}
        <br />
        by {props.book.author ? props.book.author : "Unknown"} <br />
        {props.book.pages ? `${props.book.pages} pages` : ""}{" "}
        {props.book.pages ? <br /> : ""}
        {props.book.edition ? `Edition ${props.book.edition}` : ""}{" "}
        {props.book.edition ? <br /> : ""}
      </div>
      <br />
      <button className="revealForm" onClick={formToggle}>
        Make a Note +
      </button>
      <form
        style={formVis ? { display: "block" } : { display: "none" }}
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
          event.currentTarget.noteTitle.value = "";
          event.currentTarget.content.value = "";
          event.currentTarget.quote.value = "";
          event.currentTarget.chapter.value = "";
          event.currentTarget.page.value = "";
          event.currentTarget.speaker.value = "";
          formToggle();
        }}
      >
        <input name="noteTitle" placeholder="Note Title"></input>
        <br />
        <div className="ideaquoteflex">
          <textarea
            name="content"
            className="contentinput"
            placeholder="Your ideas here. *"
            required
          ></textarea>
          <textarea name="quote" placeholder="Relevant text here."></textarea>
        </div>
        <div className="pagechapterflex">
          <input
            className="chapterinput"
            name="chapter"
            placeholder="Chapter Title/Number"
          ></input>
          <input name="page" type="number" placeholder="Page Number"></input>
        </div>
        <input name="speaker" placeholder="Speaker"></input>
        <br />
        <div className="flexbuttons">
          <button className="confirmBtn" type="submit">
            Save
          </button>
          <button className="closeBtn" type="button" onClick={formToggle}>
            Close
          </button>
          <button className="resetBtn" type="reset">
            Clear
          </button>
        </div>
      </form>
      <button className="tolibrary" onClick={() => props.toLibrary()}>
        Back to My Compendium
      </button>
      <hr />
      <input placeholder={"Search for notes"} onChange={handleSearch}></input>
      <NoteList
        book={props.book}
        list={props.book.notes}
        deleteNote={deleteNote}
        editNote={props.editNote}
        query={noteQuery}
      />
    </div>
  );
}
