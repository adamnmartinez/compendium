import BookList from "../components/BookList";
import { Book } from "../components/App";
import { ChangeEvent, useState } from "react";

export default function LibraryPage(props: {
  pullFunc: Function;
  lib: Book[];
  user: string;
  reload: Function;
  logout: Function;
  addBook: Function;
  editBook: Function;
  bookNotes: Function;
}) {
  const [libQuery, setLibQuery] = useState<string>("");

  function handleSearch(event: ChangeEvent): void {
    const target = event.currentTarget as HTMLInputElement;
    setLibQuery(target.value);
  }

  async function awaitPull(book: Book) {
    console.log(`LibraryPage: pulling \"${book.title}\"...`);
    try {
      await props.pullFunc(book);
    } catch {
      `LibraryPage: An error occured in awaitPull while pulling \"${book.title}\"`;
    }
    console.log(`LibraryPage: finished pulling \"${book.title}\"`);
  }

  return (
    <div className="libraryPage">
      <header>Compendium</header> Created by{" "}
      <a href="http://www.adamnmartinez.com" target="_blank">
        Adam Martinez
      </a>{" "}
      <p>
        Welcome, <b>{props.user}</b>
      </p>
      <hr />
      <button className="addBookBtn" onClick={() => props.addBook()}>
        New Entry +
      </button>
      <button className="reloadBtn" onClick={() => props.reload()}>
        Reload Library
      </button>
      <button className="reloadBtn" onClick={() => props.logout()}>
        Log Out
      </button>
      <input
        className="librarysearch"
        placeholder="Search My Compendium"
        onChange={handleSearch}
      ></input>
      <hr />
      <BookList
        deleteFunc={awaitPull}
        editFunc={props.editBook}
        notesFunc={props.bookNotes}
        list={props.lib}
        query={libQuery}
      />
    </div>
  );
}
