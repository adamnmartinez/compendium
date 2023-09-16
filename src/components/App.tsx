import { useEffect, useState } from "react";
import LibraryPage from "../pages/LibraryPage";
import AddBookPage from "../pages/AddBookPage";
import BookDataPage from "../pages/BookDataPage";

export class Book {
  title: string;
  author: string;
  publishedYear: number;
  pages: number;
  constructor(
    title: string,
    author: string,
    publishedYear: number,
    pages: number,
  ) {
    this.title = title;
    this.author = author;
    this.publishedYear = publishedYear;
    this.pages = pages;
  }
} // Book Class Definition

function App() {
  const [page, setPage] = useState<React.ReactElement>(<></>);
  const [library, setLibrary] = useState<Book[]>([]);

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
    />
  );

  function addBook(): void {
    setPage(addBookPageComponent);
  }

  function editBook(book: Book): void {
    setPage(<BookDataPage book={book} toLibrary={goToLibrary} />);
  }

  function goToLibrary(): void {
    setPage(libraryPageComponent);
  }

  useEffect(() => {
    setPage(libraryPageComponent);
  }, [library]);

  return <>{page}</>;
}

export default App;
