import BookList from "../components/BookList";
import { AppHeader, AppContext } from "../App";
import { Book } from "../utilities/Interface";
import AuthPage from "./AuthPage";
import { ChangeEvent, useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { getLibraryCall, deleteBookCall } from "../utilities/API";
import AddBookPage from "./AddBookPage";
import EditBookPage from "./EditBookPage";
import BookNotesPage from "./BookNotesPage";

export default function LibraryPage() {
  const [libQuery, setLibQuery] = useState<string>("");

  const {
    setIsLoading,
    token,
    user,
    setUser,
    library,
    setLibrary,
    setToken,
    setPage,
  } = useContext(AppContext) as any;

  function logoutUser() {
    localStorage.removeItem("token");
    setToken("");
    setPage(<AuthPage />);
  }

  async function delBook(book: Book) {
    Swal.fire({
      title: "Delete Book?",
      text: "This entry, and all its notes, will be deleted. Are you sure you want to proceed?",
      icon: "question",
      confirmButtonText: "I changed my mind!",
      denyButtonText: "Reduce it to atoms!",
      showDenyButton: true,
    }).then(async (result) => {
      if (result.isDenied) {
        try {
          const response = await deleteBookCall(token, book);
          if (response.status == 200) {
            Swal.fire({
              title: "Book Deleted!",
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
          console.log("App: an error occured in pushBook");
          return false;
        } finally {
          renderUserLibrary();
          return true;
        }
      } else {
        return false;
      }
    });
  }

  async function renderUserLibrary() {
    console.log("Library: render initatied");
    setIsLoading(true);

    try {
      const response = await getLibraryCall(token);
      const data = await response.json();
      setUser(data.user);

      const booksFromUser: Book[] = [];

      for (let i = 0; i < data.library.length; i++) {
        booksFromUser.push(data.library[i]);
      }

      setLibrary(booksFromUser);
    } catch (error) {
      console.log(
        "Library: an error occured while getting user library data in render",
      );

      Swal.fire({
        title: "Whoops! We couldn't load your user library! ",
        text: "You may need to log-in again. Feel free to contact us if the issue persists.",
        confirmButtonText: "Log Out",
        denyButtonText: "Stay Logged In",
        showDenyButton: true,
        icon: "error",
      }).then((response) => {
        if (response.isConfirmed) {
          logoutUser();
        }
      });

      setLibrary([
        new Book(
          "404",
          "User Library Not Found. Please log out, then log in again.",
          0,
          0,
          "",
          "",
        ),
      ]);
    } finally {
      setIsLoading(false);
      console.log("Library: render completed without errors");
    }
  }

  useEffect(() => {
    console.log("Library: page mounted, triggering user library render...");
    renderUserLibrary();
  });

  function handleSearch(event: ChangeEvent): void {
    const target = event.currentTarget as HTMLInputElement;
    setLibQuery(target.value);
  }

  return (
    <div className="libraryPage">
      <AppHeader></AppHeader>
      <p>
        Welcome, <b>{user}</b>
      </p>
      <hr />
      <button className="addBookBtn" onClick={() => setPage(<AddBookPage />)}>
        New Entry +
      </button>
      <button className="reloadBtn" onClick={renderUserLibrary}>
        Reload Library
      </button>
      <button className="logoutBtn" onClick={() => logoutUser()}>
        Log Out
      </button>
      <input
        className="librarysearch"
        placeholder="Search My Compendium"
        onChange={handleSearch}
      ></input>
      <hr />
      <BookList
        deleteFunc={delBook}
        editFunc={(book: Book) => setPage(<EditBookPage book={book} />)}
        notesFunc={(book: Book) => setPage(<BookNotesPage book={book} />)}
        list={library}
        query={libQuery}
      />
    </div>
  );
}
