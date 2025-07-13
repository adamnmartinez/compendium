import { Book, Note } from "../utilities/Interface";
import { ChangeEvent, useState, useEffect } from "react";
import { HOST } from "../App";
import { v4 as uuid } from "uuid";
import NoteList from "../components/NoteList";

export default function BookNotesPage(props: {
  book: Book;
  //user: string;
  toLibrary: Function;
  editNote: Function;
  deleteNote: Function;
  renderNotesPage: Function;
  newNote: Function;
  token: string;
}) {
  const [formVis, setFormVis] = useState<Boolean>(false);
  const [noteQuery, setNoteQuery] = useState<string>("");
  const [usernotes, setUsernotes] = useState<Note[]>([]);

  function formToggle(): void {
    formVis ? setFormVis(false) : setFormVis(true);
  }

  function renderNoteList() {
    console.log(`BookNotes: rendering notelist for \"${props.book.title}\"...`);
    try {
      fetch(HOST + "/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: props.token
        })
      }).then((response) => response.json()).then((data) => {
        let requestedBook = null

        for (let i = 0; i < data.library.length; i++){
          if (data.library[i].uuid == props.book.uuid) {
            requestedBook = data.library[i]
            break;
          }
        }

        if (!requestedBook) {
          setUsernotes([new Note("404","Entries could not be updated, please log in again.", "", "", 0, "", "",)])
          return
        }

        setUsernotes([])

        let notesfromuser: Note[] = [];

        for (let i = 0; i < requestedBook.notes.length; i++) {
          notesfromuser.push(requestedBook.notes[i])
        }

        setUsernotes(notesfromuser);
      })
    } catch (e) {
      console.log("BookNotes: an error occured while getting user data");
      console.error(e)
      setUsernotes([new Note("500","Page Error Occured", "", "", 0, "", "",)])
      return
    }
  }

  async function awaitPull(book: Book, note: Book) {
    console.log(`BookNotes: pulling note \"${note.title}\"...`);
    try {
      await props.deleteNote(book, note);
    } catch {
      `BookNotes: an error occured in awaitPull while deleting \"${note.title}\"`;
    } finally {
      console.log(
        `BookNotes: finished pulling note \"${note.title}\" (${note.uuid}), from \"${book.title}\"`,
      );
    }
  }

  function handleSearch(event: ChangeEvent): void {
    const target = event.currentTarget as HTMLInputElement;
    setNoteQuery(target.value);
  }

  useEffect(() => {
    renderNoteList();
  }, []);

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
            uuid(),
          );
          props.newNote(props.book, newNote);
          formToggle();
          setTimeout(() => {
            renderNoteList();
          }, 500);
        }}
      >
        <input name="noteTitle" placeholder="Note Title" required></input>
        <br />
        <div className="ideaquoteflex">
          <textarea
            name="content"
            className="contentinput"
            placeholder="Your ideas here. *"
          ></textarea>
          <textarea name="quote" placeholder="Relevant text here."></textarea>
        </div>
        <div className="pagechapterflex">
          <input
            className="chapterinput"
            name="chapter"
            placeholder="Chapter/Part/Section"
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
        deleteNote={awaitPull}
        editNote={props.editNote}
        renderNoteList={renderNoteList}
        query={noteQuery}
        book={props.book}
        list={usernotes}
      />
    </div>
  );
}
