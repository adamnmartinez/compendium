import { Book } from "./components/App";
import { Note } from "./components/App";
export default class Storage {
  hasLocalStorage(): boolean {
    return window.localStorage.library ? true : false;
  }

  saveStorage(library: Book[]): void {
    window.localStorage.library = JSON.stringify(library);
  }

  loadStorage(): Book[] {
    const booksFromStorage: Book[] = [];
    JSON.parse(window.localStorage.library).forEach((book: Book) => {
      const bookTitle = book.title;
      const author = book.author;
      const year = book.publishedYear;
      const pages = book.pages;
      const edition = book.edition;
      const bookObject = new Book(bookTitle, author, year, pages, edition);
      book.notes.forEach((note: Note) => {
        const noteTitle = note.title;
        const content = note.content;
        const quote = note.quote;
        const chapter = note.chapter;
        const page = note.page;
        const speaker = note.speaker;
        const noteObject = new Note(
          noteTitle,
          content,
          quote,
          chapter,
          page,
          speaker,
        );
        bookObject.notes.push(noteObject);
      });
      booksFromStorage.push(book);
    });
    return booksFromStorage;
  }
}
