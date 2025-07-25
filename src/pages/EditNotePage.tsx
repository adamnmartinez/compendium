import { Book, Note } from "../utilities/Interface";
import Swal from "sweetalert2";
import { modifyNoteCall } from "../utilities/API";
import { AppContext } from "../App";
import { useContext } from "react";
import AuthPage from "./AuthPage";
import BookNotesPage from "./BookNotesPage";

export default function EditNotePage(props: { note: Note; book: Book }) {
  //@ts-ignore
  const { setPage, token, setToken } = useContext(AppContext);

  async function modifyNote(book: Book, note: Note, newNote: Note) {
    function logoutUser() {
      localStorage.removeItem("token");
      setToken("");
      setPage(<AuthPage />);
    }

    try {
      const response = await modifyNoteCall(token, book, note, newNote);
      if (response.status == 200) {
        Swal.fire({
          title: "Changes Applied!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else if (response.status == 400) {
        Swal.fire({
          title: "Invalid Token!",
          text: "Looks like your authentication token expired! Try logging in again.",
          icon: "error",
          confirmButtonText: "Log me out!",
          denyButtonText: "Keep me logged in.",
          showDenyButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            logoutUser();
          }
        });
      } else if (response.status == 403) {
        Swal.fire({
          title: "Unauthenticated!",
          text: "Looks like you aren't authorized to perform that action, sorry! Try logging in again.",
          icon: "error",
          confirmButtonText: "Log me out!",
          denyButtonText: "Keep me logged in.",
          showDenyButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            logoutUser();
          }
        });
      } else if (response.status == 404) {
        Swal.fire({
          title: "Library Not Found!",
          text: "Whoops! We couldn't find your library. Try logging in again.",
          icon: "error",
          confirmButtonText: "Log me out!",
          denyButtonText: "Keep me logged in.",
          showDenyButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            logoutUser();
          }
        });
      } else if (response.status == 500) {
        Swal.fire({
          title: "Something went wrong...",
          text: "Something unexpected caused our servers to fail, please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch {
      console.log("App: an error occured in modifyNote");
      return false;
    } finally {
      setTimeout(() => setPage(<BookNotesPage book={book} />), 500);
    }
    return true;
  }

  return (
    <div className="noteEditPage">
      <div className="bookInfo">
        <span className="bookTitle">
          <i>{props.book.title}</i>{" "}
          {props.book.publishedYear ? ` (${props.book.publishedYear})` : ""}
        </span>{" "}
        <br />
        by {props.book.authors ? props.book.authors : "Unknown"} <br />
        {props.book.pages ? `${props.book.pages} pages` : ""}{" "}
        {props.book.pages ? <br /> : ""}
        {props.book.edition ? `Edition ${props.book.edition}` : ""}{" "}
        {props.book.edition ? <br /> : ""}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const updatedNote = new Note(
            event.currentTarget.noteTitle.value,
            event.currentTarget.content.value,
            event.currentTarget.quote.value,
            event.currentTarget.chapter.value,
            event.currentTarget.page.value,
            event.currentTarget.speaker.value,
            props.note.uuid,
          );
          modifyNote(props.book, props.note, updatedNote);
          //props.toBookNotes(props.book);
          //setTimeout(() => props.toBookNotes(props.book), 500);
        }}
      >
        <input
          name="noteTitle"
          type="text"
          defaultValue={props.note.title}
          placeholder="Note Title"
          required
        ></input>
        <br />
        <div className="ideaquoteflex">
          <textarea
            name="content"
            className="contentinput"
            placeholder="Note Content"
            defaultValue={props.note.content}
          ></textarea>
          <br />
          <textarea
            name="quote"
            placeholder="Quote(s)"
            defaultValue={props.note.quote}
          ></textarea>
        </div>
        <div className="pagechapterflex">
          <input
            name="chapter"
            type="text"
            className="chapterinput"
            placeholder="Chapter/Part/Section"
            defaultValue={props.note.chapter}
          ></input>
          <input
            name="page"
            type="number"
            placeholder="Page Number"
            defaultValue={props.note.page}
          ></input>
        </div>
        <input
          name="speaker"
          type="text"
          placeholder="Speaker"
          defaultValue={props.note.speaker}
        ></input>
        <br />
        <div className="flexbuttons">
          <button className="submitBtn" type="submit">
            Save
          </button>
          <button
            className="cancelBtn"
            type="button"
            onClick={() => setPage(<BookNotesPage book={props.book} />)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
