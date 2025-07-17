import { Book, Note } from "../utilities/Interface";
import { ChangeEvent, useState, useEffect, useContext } from "react";
import { HOST } from "../App";
import { v4 as uuid } from "uuid";
import NoteList from "../components/NoteList";
import { AppContext } from "../App";
import AuthPage from "./AuthPage";
import LibraryPage from "./LibraryPage";
import Swal from "sweetalert2";
import { uploadNoteCall, deleteNoteCall } from "../utilities/API";
import EditNotePage from "./EditNotePage";

export default function BookNotesPage(props: {
  book: Book;
}) {
  const [formVis, setFormVis] = useState<Boolean>(false);
  const [noteQuery, setNoteQuery] = useState<string>("");
  const [usernotes, setUsernotes] = useState<Note[]>([]);

  //@ts-ignore
  const { token, setToken, setPage } = useContext(AppContext)
    
  function logoutUser(){
    localStorage.removeItem("token") 
    setToken("")
    setPage(<AuthPage />)
  }

  function formToggle(): void {
    formVis ? setFormVis(false) : setFormVis(true);
  }

  async function addNote(book: Book, note: Note): Promise<Boolean> {
    try {
      const response = await uploadNoteCall(token, book, note)
      if (response.status == 200) {
        Swal.fire({
          title: 'Note Added!',
          icon: 'success',
          confirmButtonText: "OK",
        })
      } else if (response.status == 400) {
        Swal.fire({
          title: 'Invalid Token!',
          text: "Looks like your authentication token expired! Try logging in again.",
          icon: 'error',
          confirmButtonText: "Log me out!",
          denyButtonText: "Keep me logged in.",
          showDenyButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            logoutUser()
          }
        })
      } else if (response.status == 403) {
        Swal.fire({
          title: 'Unauthenticated!',
          text: "Looks like you aren't authorized to perform that action, sorry! Try logging in again.",
          icon: 'error',
          confirmButtonText: "Log me out!",
          denyButtonText: "Keep me logged in.",
          showDenyButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            logoutUser()
          }
        })
      } else if (response.status == 404) {
        Swal.fire({
          title: 'Library Not Found!',
          text: "Whoops! We couldn't find your library. Try logging in again.",
          icon: 'error',
          confirmButtonText: "Log me out!",
          denyButtonText: "Keep me logged in.",
          showDenyButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            logoutUser()
          }
        })
      } else if (response.status == 500) {
        Swal.fire({
          title: 'Something went wrong...',
          text: "Something unexpected caused our servers to fail, please try again later.",
          icon: 'error',
          confirmButtonText: "OK"
        })
      }
    } catch {
      console.log("App: an error occured in addNote");
      return false;
    }
    return true;
  }

  async function delNote(book: Book, note: Note) {
    try {
      const response = await deleteNoteCall(token, book, note)
      if (response.status == 200) {
        Swal.fire({
          title: 'Note Deleted!',
          icon: 'success',
          confirmButtonText: "OK",
        })
      } else if (response.status == 400) {
        Swal.fire({
          title: 'Invalid Token!',
          text: "Looks like your authentication token expired! Try logging in again.",
          icon: 'error',
          confirmButtonText: "Log me out!",
          denyButtonText: "Keep me logged in.",
          showDenyButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            logoutUser()
          }
        })
      } else if (response.status == 403) {
        Swal.fire({
          title: 'Unauthenticated!',
          text: "Looks like you aren't authorized to perform that action, sorry! Try logging in again.",
          icon: 'error',
          confirmButtonText: "Log me out!",
          denyButtonText: "Keep me logged in.",
          showDenyButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            logoutUser()
          }
        })
      } else if (response.status == 404) {
        Swal.fire({
          title: 'Library Not Found!',
          text: "Whoops! We couldn't find your library. Try logging in again.",
          icon: 'error',
          confirmButtonText: "Log me out!",
          denyButtonText: "Keep me logged in.",
          showDenyButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            logoutUser()
          }
        })
      } else if (response.status == 500) {
        Swal.fire({
          title: 'Something went wrong...',
          text: "Something unexpected caused our servers to fail, please try again later.",
          icon: 'error',
          confirmButtonText: "OK"
        })
      }
    } catch {
      console.log("App: an error occured in delNote");
      return false;
    }
    return true;
  }

  function renderNoteList() {
    console.log(`BookNotes: rendering notelist for \"${props.book.title}\"...`);
    try {
      fetch(HOST + "/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token
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
        Cite This Source
      </button>
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
          addNote(props.book, newNote);
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
      <button className="tolibrary" onClick={() => setPage(<LibraryPage />)}>
        Back to My Compendium
      </button>
      <hr />
      <input placeholder={"Search for notes"} onChange={handleSearch}></input>
      <NoteList
        deleteNote={delNote}
        editNote={(note: Note, book: Book) => setPage(<EditNotePage book={book} note={note}/>)}
        renderNoteList={renderNoteList}
        query={noteQuery}
        book={props.book}
        list={usernotes}
      />
    </div>
  );
}
