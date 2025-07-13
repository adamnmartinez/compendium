import { useEffect, useState } from "react";
import { uploadBookCall, deleteBookCall, modifyBookCall } from "./utilities/API";
import Swal from "sweetalert2";

// Pages
import LibraryPage from "./pages/LibraryPage";
import AddBookPage from "./pages/AddBookPage";
import EditBookPage from "./pages/EditBookPage";
import BookNotesPage from "./pages/BookNotesPage";
import EditNotePage from "./pages/EditNotePage";
import AuthPage from "./pages/AuthPage";
import Loading from "./components/LoadingOverlay";

// Components
import { Book, Note } from "./utilities/Interface";

// API Methods
import { getLibraryCall } from "./utilities/API"

export const HOST = 'https://compendium-api-v246.onrender.com'

export function AppHeader(){
  return(
    <>
      <header>Compendium</header>
      by <a className="headerlink" href="https://github.com/adamnmartinez">Adam Martinez</a>
    </>
  )
}

function App() {
  
  const [user, setUser] = useState<string>("")
  const [library, setLibrary] = useState<Book[]>([])
  const [page, setPage] = useState<React.ReactElement>(<></>)
  const [token, setToken] = useState<string>(localStorage.getItem("token") || "")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function logoutUser() {
    localStorage.removeItem("token") 
    setToken("")
    setPage(authPageComponent)
  }

  async function renderUserLibrary() {
    console.log("App: rendering library...");
    setIsLoading(true)

    try {
      const response = await getLibraryCall(token)
      const data = await response.json()
      setUser(data.user)
      
      let booksFromUser: Book[] = []
      
      for (let i = 0; i < data.library.length; i++){
        booksFromUser.push(data.library[i])
      }

      setLibrary(booksFromUser);

    } catch (error) {
      console.log(
        "App: an error occured while getting user library data in renderUserLibrary()",
      );

      Swal.fire({
        title: "Whoops! We couldn't load your user library! ",
        text: "You may need to log-in again. Feel free to contact us if the issue persists.",
        confirmButtonText: "Log Out",
        denyButtonText: "Stay Logged In",
        showDenyButton: true,
        icon: "error"
      }).then((response) => {
        if (response.isConfirmed) {
          logoutUser()
        }
      })

      setLibrary([new Book(
        "404", "User Library Not Found. Please log out, then log in again.", 0, 0, "", ""
      )])
    } finally {
      setIsLoading(false)
    }
  };

  // PAGE
  useEffect(() => {
    if (token != "") {
      console.log("App: authenticated user " + user);
      renderUserLibrary();
      setPage(libraryPageComponent)
    } else {
      setPage(authPageComponent)
    }
  }, [token]);

  useEffect(() => {
    (token != "") ? setPage(libraryPageComponent) : setPage(authPageComponent);
  }, [library]);

  // Library Functions
  async function addBook(book: Book) {
    try {
      const response = await uploadBookCall(token, book)
      if (response.status == 200) {
        Swal.fire({
          title: 'Book Added',
          text: 'Want to get started taking notes?',
          icon: 'success',
          confirmButtonText: "Let's Go!",
          denyButtonText: 'Maybe Later...',
          showDenyButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            bookNotesPage(book)
          }
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
      console.log("App: an error occured in pushBook");
      return false;
    } finally {
      setTimeout(() => renderUserLibrary(), 500);
    }
    return true;
  }

  async function delBook(book: Book) {
    Swal.fire({
      title: 'Delete Book?',
      text: 'This entry, and all its notes, will be deleted. Are you sure you want to proceed?',
      icon: 'question',
      confirmButtonText: "I changed my mind!",
      denyButtonText: 'Reduce it to atoms!',
      showDenyButton: true
    }).then(async (result) => {
      if (result.isDenied) {
        try {
          const response = await deleteBookCall(token, book)
          if (response.status == 200) {
            Swal.fire({
              title: 'Book Deleted!',
              text: 'Adiós, libro.',
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
          console.log("App: an error occured in pushBook");
          return false;
        } finally {
          setTimeout(() => renderUserLibrary(), 500);
          return true;
        }
      } else {
        return false
      }
    })
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
      setTimeout(() => renderUserLibrary(), 1000);
      return true;
    }
  }

  // Note Functions
  async function addNote(book: Book, note: Note): Promise<Boolean> {
    try {
      fetch(HOST + `/account/library/entry/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          bookID: book.uuid,
          note: note
        }),
      });
    } catch {
      console.log("App: an error occured in addNote");
      return false;
    }
    return true;
  }

  async function delNote(book: Book, note: Note) {
    try {
      fetch(HOST + `/account/library/entry/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          bookID: book.uuid,
          noteID: note.uuid
        })
      });
    } catch {
      console.log("App: an error occured in delNote");
      return false;
    } finally {
      //setTimeout(() => bookNotesPage(book), 500);
    }
    return true;
  }

  async function modifyNote(book: Book, note: Note, newNote: Note) {
    try {
      fetch(HOST + `/account/library/entry/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          bookID: book.uuid,
          noteID: note.uuid,
          modified: newNote
        }),
      });
    } catch {
      console.log("App: an error occured in modifyNote");
      return false;
    } finally {
      setTimeout(() => bookNotesPage(book), 500);
    }
    return true;
  }

  //Component Page Definitions
  const addBookPageComponent = (
    <AddBookPage pushFunc={addBook} toLibrary={goToLibrary} />
  );

  const libraryPageComponent = (
    <LibraryPage
      pullFunc={delBook}
      lib={library}
      user={user}
      reload={reload}
      logout={() => {
        logoutUser()
      }}
      addBook={addBookPage}
      editBook={editBookPage}
      bookNotes={bookNotesPage}
    />
  );

  const authPageComponent = (
    <AuthPage setLoading={setIsLoading} setToken={setToken} />
  );

  function addBookPage(): void {
    setPage(addBookPageComponent);
  }

  function editBookPage(book: Book): void {
    setPage(
      <EditBookPage
        editFunc={modifyBook}
        book={book}
        toLibrary={goToLibrary}
        setLoading={setIsLoading}
      />,
    );
  }

  function editNotePage(note: Note, book: Book): void {
    setPage(
      <EditNotePage
        note={note}
        editFunc={modifyNote}
        book={book}
        toBookNotes={bookNotesPage}
      />,
    );
  }

  function bookNotesPage(book: Book): void {
    setPage(
      <BookNotesPage
        token={token}
        book={book}
        toLibrary={goToLibrary}
        editNote={editNotePage}
        deleteNote={delNote}
        renderNotesPage={bookNotesPage}
        newNote={addNote}
      />,
    );
  }

  function goToLibrary(): void {
    setPage(libraryPageComponent);
    console.log("App: Library Page Loaded");
  }

  function reload(): void {
    renderUserLibrary();
  }

  return (<div>
      <Loading hidden={!isLoading} />
      <div className="pageWrapper">
        {page}
      </div>
    </div>);
}

export default App;
