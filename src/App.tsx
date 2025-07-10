import { useEffect, useState } from "react";
import LibraryPage from "./pages/LibraryPage";
import AddBookPage from "./pages/AddBookPage";
import EditBookPage from "./pages/EditBookPage";
import BookNotesPage from "./pages/BookNotesPage";
import EditNotePage from "./pages/EditNotePage";
import AuthPage from "./pages/AuthPage";
import Loading from "./components/LoadingOverlay";
import Swal from "sweetalert2";

// API HOST
export const HOST = 'https://compendium-api-v246.onrender.com'

// TESTING
//export const HOST = 'http://localhost:8080' 

export class Book {
  title: string;
  author: string;
  publishedYear: number;
  pages: number;
  edition: string;
  notes: Note[];
  uuid: string;
  constructor(
    title: string,
    author: string,
    publishedYear: number,
    pages: number,
    edition: string,
    uuid: string,
  ) {
    this.title = title;
    this.author = author;
    this.publishedYear = publishedYear;
    this.pages = pages;
    this.edition = edition;
    this.notes = [];
    this.uuid = uuid;
  }
} // Book Class Definition

export class Note {
  title: string;
  content: string;
  quote: string;
  chapter: string;
  page: number;
  speaker: string;
  uuid: string;
  constructor(
    title: string,
    content: string,
    quote: string,
    chapter: string,
    page: number,
    speaker: string,
    uuid: string,
  ) {
    this.title = title;
    this.content = content;
    this.quote = quote;
    this.chapter = chapter;
    this.page = page;
    this.speaker = speaker;
    this.uuid = uuid;
  }
} // Book Class Definition

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
  
  let booksfromuser: Book[] = []

  function renderUserLibrary() {
    console.log("App: rendering library...");
    setIsLoading(true)

    try {
      fetch(HOST + "/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token
        })
      }).then((response) => {
        response.json().then((data) => {
          setUser(data.user)

          for (let i = 0; i < data.library.length; i++){
            booksfromuser.push(data.library[i])
          }

          setLibrary(booksfromuser);
        })
      });
    } catch (error) {
      console.log(
        "App: an error occured while getting user library data in renderUserLibrary()",
      );
      setLibrary([new Book(
        "404", "User Library Not Found, Please log in again.", 0, 0, "", ""
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
      await fetch(HOST + `/account/library/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          book: book
        }),
      });
    } catch {
      console.log("App: an error occured in pushBook");
      return false;
    } finally {
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
    }).then((result) => {
      if (result.isDenied) {
        try {
          fetch(HOST + `/account/library/remove`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: token,
              uuid: book.uuid
            })
          });
        } catch {
          console.log("App: an error occured in delBook");
          return false;
        } finally {
          Swal.fire({
            title: 'Book Deleted',
            text: 'Adiós, libro.',
            icon: 'success',
            confirmButtonText: "OK",
          })
          setTimeout(() => renderUserLibrary(), 500);
        }
        return true;
      } else {
        return false
      }
    })
  }

  async function modifyBook(old: Book, modified: Book) {
    try {
      fetch(HOST + `/account/library/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          uuid: old.uuid,
          modified: modified
        }),
      });
    } catch {
      console.log("App: an error occured in modifyBook");
      return false;
    } finally {
      Swal.fire({
          title: 'Changes Applied!',
          text: 'You may need to wait a minute or two for changes to be reflected in your library.',
          icon: 'success',
          confirmButtonText: "OK",
      })
      setTimeout(() => renderUserLibrary(), 1000);
    }
    return true;
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
        localStorage.removeItem("token") 
        setToken("")
        setPage(authPageComponent)
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
