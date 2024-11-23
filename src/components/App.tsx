import { useEffect, useState } from "react";
import LibraryPage from "../pages/LibraryPage";
import AddBookPage from "../pages/AddBookPage";
import EditBookPage from "../pages/EditBookPage";
import BookNotesPage from "../pages/BookNotesPage";
import EditNotePage from "../pages/EditNotePage";
import AuthPage from "../pages/AuthPage";

// API HOST
export const HOST = 'https://compendium-api-v246.onrender.com'

// TESTING
//export const HOST = 'http://localhost:8080' 

export async function fetchUsers() {
  try {
    const response = await fetch(HOST + "/users");
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

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
      by <a href="https://github.com/adamnmartinez">Adam Martinez</a>
    </>
  )
}

function App() {
  const [authenticated, setAuthenticated] = useState<Boolean>(false);
  const [user, setUser] = useState<string>("");
  const [library, setLibrary] = useState<Book[]>([]);
  const [page, setPage] = useState<React.ReactElement>(<></>);

  let userlib: any[] = [];
  let booksfromuser: Book[] = [];

  function renderUserLibrary() {
    console.log("App: rendering library...");
    fetchUsers().then((data) => {
      try {
        data.forEach((thisuser: any) => {
          if (thisuser.username === user) {
            userlib = thisuser.userlib.library;
          }
        });
        if (userlib.length !== 0) {
          userlib.forEach((entry) => {
            const bookfromuser = new Book(
              entry.title,
              entry.author,
              entry.publishedYear,
              entry.pages,
              entry.edition,
              entry.uuid,
            );
            booksfromuser.push(bookfromuser);
          });
        }
      } catch (error) {
        console.log(
          "App: an error occured while getting user library data in renderUserLibrary()",
        );
        throw error;
      } finally {
        setLibrary(booksfromuser);
      }
      console.log("App: finished rendering library");
    });
  }

  // PAGE
  useEffect(() => {
    if (authenticated) {
      console.log("App: authenticated user " + user);
    }
    renderUserLibrary();
  }, [authenticated]);

  useEffect(() => {
    authenticated ? setPage(libraryPageComponent) : setPage(authPageComponent);
  }, [library]);

  // Library Functions
  async function addBook(book: Book) {
    try {
      fetch(HOST + `/${user}/addBook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });
    } catch {
      console.log("App: an error occured in pushBook");
      return false;
    } finally {
      setTimeout(() => renderUserLibrary(), 500);
    }
    return true;
  }

  async function delBook(book: Book) {
    try {
      fetch(HOST + `/${user}/delBook/${book.uuid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      console.log("App: an error occured in delBook");
      return false;
    } finally {
      setTimeout(() => renderUserLibrary(), 500);
    }
    return true;
  }

  async function modifyBook(old: Book, modified: Book) {
    try {
      fetch(HOST + `/${user}/modBook/${old.uuid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modified),
      });
    } catch {
      console.log("App: an error occured in modifyBook");
      return false;
    } finally {
      setTimeout(() => renderUserLibrary(), 500);
    }
    return true;
  }

  // Note Functions
  async function addNote(book: Book, note: Note): Promise<Boolean> {
    try {
      fetch(HOST + `/${user}/addNote/${book.uuid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
    } catch {
      console.log("App: an error occured in addNote");
      return false;
    }
    return true;
  }

  async function delNote(book: Book, note: Note) {
    let book_id = book.uuid;
    let note_id = note.uuid;
    try {
      fetch(HOST + `/${user}/delNote/${book_id}/${note_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      console.log("App: an error occured in modifyBook");
      return false;
    } finally {
      //setTimeout(() => bookNotesPage(book), 500);
    }
    return true;
  }

  async function modifyNote(book: Book, note: Note, newNote: Note) {
    try {
      fetch(HOST + `/${user}/modNote/${book.uuid}/${note.uuid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
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
      logout={() => setAuthenticated(false)}
      addBook={addBookPage}
      editBook={editBookPage}
      bookNotes={bookNotesPage}
    />
  );
  const authPageComponent = (
    <AuthPage setAuthenticated={setAuthenticated} setUser={setUser} />
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
        book={book}
        user={user}
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

  return <div className="pageWrapper">{page}</div>;
}

export default App;
