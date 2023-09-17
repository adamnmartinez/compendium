import { useEffect, useState } from "react";
import Storage from "../storage";

import LibraryPage from "../pages/LibraryPage";
import AddBookPage from "../pages/AddBookPage";
import EditBookPage from "../pages/EditBookPage";
import BookNotesPage from "../pages/BookNotesPage";
import EditNotePage from "../pages/EditNotePage";

export class Book {
  title: string;
  author: string;
  publishedYear: number;
  pages: number;
  edition: string;
  notes: Note[];
  constructor(
    title: string,
    author: string,
    publishedYear: number,
    pages: number,
    edition: string,
  ) {
    this.title = title;
    this.author = author;
    this.publishedYear = publishedYear;
    this.pages = pages;
    this.edition = edition;
    this.notes = [];
  }
} // Book Class Definition

export class Note {
  title: string;
  content: string;
  quote: string;
  chapter: string;
  page: number;
  speaker: string;
  constructor(
    title: string,
    content: string,
    quote: string,
    chapter: string,
    page: number,
    speaker: string,
  ) {
    this.title = title;
    this.content = content;
    this.quote = quote;
    this.chapter = chapter;
    this.page = page;
    this.speaker = speaker;
  }
} // Book Class Definition

const storage = new Storage();

const theHobbit = new Book("The Hobbit", "J.R.R Tolkien", 1937, 310, "One");

function App() {
  const storedLib: Book[] = storage.hasLocalStorage()
    ? storage.loadStorage()
    : [theHobbit];
  const [page, setPage] = useState<React.ReactElement>(<></>);
  const [library, setLibrary] = useState<Book[]>(storedLib);

  function pushBook(book: Book): void {
    setLibrary((oldLib: Book[]) => [...oldLib, book]);
  }

  function pullBook(book: Book): void {
    const newArr = [...library];
    const index = newArr.indexOf(book);
    newArr.splice(index, 1);
    setLibrary(newArr);
  }

  //Define Components with required Properties
  const addBookPageComponent = (
    <AddBookPage pushFunc={pushBook} toLibrary={goToLibrary} />
  );
  const libraryPageComponent = (
    <LibraryPage
      pullFunc={pullBook}
      lib={library}
      addBook={addBook}
      editBook={editBook}
      bookNotes={bookNotes}
    />
  );

  function addBook(): void {
    setPage(addBookPageComponent);
  }

  function editBook(book: Book): void {
    setPage(<EditBookPage book={book} toLibrary={goToLibrary} />);
  }

  function editNote(note: Note, book: Book): void {
    setPage(<EditNotePage note={note} book={book} toBookNotes={bookNotes} />);
  }

  function bookNotes(book: Book): void {
    setPage(
      <BookNotesPage
        book={book}
        toLibrary={goToLibrary}
        editNote={editNote}
        renderNotesPage={bookNotes}
      />,
    );
  }

  function goToLibrary(): void {
    setPage(libraryPageComponent);
  }

  function save(): void {
    storage.saveStorage(library);
  }

  useEffect(() => {
    setPage(libraryPageComponent);
  }, [library]);

  save();

  return <>{page}</>;
}

export default App;
