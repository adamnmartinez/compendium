import BookList from "../components/BookList";
import { Book } from "../components/App";
import { ChangeEvent, useState } from "react";

export default function LibraryPage(props: {
  pullFunc: Function;
  lib: Book[];
  addBook: Function;
  editBook: Function;
  bookNotes: Function;
}) {
  const [libQuery, setLibQuery] = useState<string>("");

  function handleSearch(event: ChangeEvent): void {
    const target = event.currentTarget as HTMLInputElement;
    setLibQuery(target.value);
  }

  return (
    <div className="libraryPage">
      <header>Compendium</header> Created by{" "}
      <a href="http://www.adamnmartinez.com" target="_blank">
        Adam Martinez
      </a>{" "}
      <br />
      <br />
      <button className="addBookBtn" onClick={() => props.addBook()}>
        New Entry +
      </button>
      <input
        className="librarysearch"
        placeholder="Search My Compendium"
        onChange={handleSearch}
      ></input>
      <BookList
        deleteFunc={props.pullFunc}
        editFunc={props.editBook}
        notesFunc={props.bookNotes}
        list={props.lib}
        query={libQuery}
      />
      
    </div>
  );
}
