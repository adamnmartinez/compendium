import { AppHeader, AppContext } from "../App";
import { Book } from "../utilities/Interface";
import Swal from "sweetalert2";
import { modifyBookCall } from "../utilities/API";
import { useContext } from "react";
import LibraryPage from "./LibraryPage";
import AuthPage from "./AuthPage";

export default function EditBookPage(props: {
  book: Book;
}) {
  //@ts-ignore
  const { token, setToken, setPage } = useContext(AppContext)

  function logoutUser(){
    localStorage.removeItem("token") 
    setToken("")
    setPage(<AuthPage />)
  }

  async function modifyBook(old: Book, modified: Book) {
    try {
      const response = await modifyBookCall(token, old, modified)
      if (response.status == 200) {
        Swal.fire({
          title: 'Changes Applied!',
          text: 'You may need to wait a minute or two for changes to be reflected in your library.',
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
      console.log("App: an error occured in modifyBook");
      return false;
    } finally {
      setTimeout(() => setPage(<LibraryPage />), 1000);
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
            event.currentTarget.edition.value,
            props.book.uuid,
          );
          updatedEntry.notes = props.book.notes;
          modifyBook(props.book, updatedEntry);
          setPage(<LibraryPage />);
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
          placeholder="Author"
          defaultValue={props.book.author}
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
        <p>Edition Number/Title</p>
        <input
          name="edition"
          type="text"
          placeholder="Edition Name/Number"
          defaultValue={props.book.edition}
        ></input>
        <br />
        <div className="flexbuttons">
          <button className="submitBtn" type="submit">
            Save Changes
          </button>
          <button className="cancelBtn" onClick={() => setPage(<LibraryPage />)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
