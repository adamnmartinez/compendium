import { AppHeader, AppContext } from "../App";
import { Book } from "../utilities/Interface";
import Swal from "sweetalert2";
import { modifyBookCall } from "../utilities/API";
import { useContext } from "react";
import LibraryPage from "./LibraryPage";
import AuthPage from "./AuthPage";

export default function EditBookPage(props: { book: Book }) {
  //@ts-ignore
  const { token, setToken, setPage } = useContext(AppContext);

  function logoutUser() {
    localStorage.removeItem("token");
    setToken("");
    setPage(<AuthPage />);
  }

  async function modifyBook(old: Book, modified: Book) {
    try {
      const response = await modifyBookCall(token, old, modified);
      if (response.status == 200) {
        Swal.fire({
          title: "Changes Applied!",
          text: "You may need to wait a minute or two for changes to be reflected in your library.",
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
      console.log("EditBook: Done!");
    } catch {
      console.log("App: an error occured in modifyBook");
      return false;
    } finally {
      setPage(<LibraryPage />);
      return true;
    }
  }

  return (
    <div className="editBookPage">
      <AppHeader></AppHeader>
      <br />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const updatedEntry = new Book(
            event.currentTarget.bookTitle.value,
            event.currentTarget.author.value,
            event.currentTarget.year.value,
            event.currentTarget.pages.value,
            props.book.uuid,
            event.currentTarget.edition.value,
            event.currentTarget.publisher.value,
            event.currentTarget.container.value,
            event.currentTarget.volume.value,
            event.currentTarget.number.value,
            event.currentTarget.url.value,
            event.currentTarget.editors.value,
            event.currentTarget.translators.value,
          );
          updatedEntry.notes = props.book.notes;
          modifyBook(props.book, updatedEntry);
        }}
      >
        <p>Title *</p>
        <input
          name="bookTitle"
          type="text"
          defaultValue={props.book.title}
          placeholder="Title"
          required
        ></input>
        <br />
        <p>Author(s)</p>
        <input
          name="author"
          type="text"
          placeholder={"Author 1, Author 2..."}
          defaultValue={props.book.authors}
        ></input>
        <br />
        <p>Year Published</p>
        <input
          name="year"
          type="number"
          placeholder="Year Published"
          defaultValue={props.book.publishedYear}
        ></input>
        <br />
        <p>Pages</p>
        <input
          name="pages"
          type="number"
          placeholder="Pages"
          defaultValue={props.book.pages}
        ></input>
        <br />
        <p>Edition / Version</p>
        <input
          placeholder={`i.e. First Edition`}
          name="edition"
          type="text"
          defaultValue={props.book.edition}
        ></input>
        <br />
        <p>Publisher</p>
        <input
          name="publisher"
          defaultValue={props.book.publisher}
          type="text"
        ></input>
        <br />
        <div className="dualinputflex">
          <div className="left">
            <p>Container</p>
            <input
              name="container"
              placeholder={`Journal Name, Name of Collection...`}
              defaultValue={props.book.container}
              type="text"
            ></input>
          </div>
          <div className="right">
            <p>Container Authors / Editors</p>
            <input
              name="editors"
              placeholder={"Editor 1, Editor 2..."}
              defaultValue={props.book.editors}
              type="text"
            ></input>
          </div>
        </div>
        <div className="dualinputflex">
          <div className="left">
            <p>Volume</p>
            <input
              name="volume"
              defaultValue={props.book.volume > 0 ? props.book.volume : ""}
              type="number"
            ></input>
          </div>
          <div className="right">
            <p>No.</p>
            <input
              name="number"
              defaultValue={props.book.number > 0 ? props.book.number : ""}
              type="number"
            ></input>
          </div>
        </div>
        <p>URL</p>
        <input name="url" type="text" defaultValue={props.book.url}></input>
        <br />
        <p>Translators</p>
        <input
          name="translators"
          placeholder={"Translator 1, Translator 2..."}
          defaultValue={props.book.translators}
          type="text"
        ></input>
        <br />
        <div className="flexbuttons">
          <button className="submitBtn" type="submit">
            Save Changes
          </button>
          <button
            className="cancelBtn"
            onClick={() => setPage(<LibraryPage />)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
