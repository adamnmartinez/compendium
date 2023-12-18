import { ChangeEvent, useState } from "react";
import { Book } from "../components/App";
import { v4 as uuid } from "uuid";

export default function AddBookPage(props: {
  pushFunc: Function;
  toLibrary: Function;
}) {
  const [searchResults, setSearchResults] = useState<React.ReactElement[]>([]);

  async function awaitPush(newBook: Book) {
    console.log(`AddBookPage: adding \"${newBook.title}\"...`);
    try {
      await props.pushFunc(newBook);
    } catch {
      `AddBookPage: an error occured in awaitPush while pushing \"${newBook.title}\"`;
    } finally {
      console.log(
        `AddBookPage: finished pushing \"${newBook.title}\" (${newBook.uuid})`,
      );
    }
  }

  async function searchAPI(event: ChangeEvent) {
    const target = event.target as HTMLInputElement;
    if (target === null) {
      return;
    }
    const queryinput = target.value;
    const query = queryinput.replace(" ", "+");
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`,
    );
    const dataJSON = await response.json();

    setSearchResults([]);

    dataJSON.items.forEach((item: any) => {
      let authorString: string = item.volumeInfo.authors[0];
      const itemYear = item.volumeInfo.publishedDate.slice(0, 4);
      const pages =
        item.volumeInfo.pageCount !== 0 ? item.volumeInfo.pageCount : null;
      item.volumeInfo.authors.forEach((author: string) => {
        if (author !== item.volumeInfo.authors[0]) {
          authorString += `, ${author}`;
        }
      });
      const itemElement = (
        <li>
          <p>
            {item.volumeInfo.title} ({itemYear})
          </p>
          {authorString} {pages ? <br /> : ""}
          {pages ? `${pages} pages` : ""} <br />
          <button
            onClick={() => {
              const newBook = new Book(
                item.volumeInfo.title,
                authorString,
                itemYear,
                pages ? pages : null,
                "",
                uuid(),
              );
              awaitPush(newBook);
              props.toLibrary();
            }}
          >
            Save to My Compendium
          </button>
        </li>
      );
      setSearchResults((oldSearch) => [...oldSearch, itemElement]);
    });
  }

  return (
    <div className="addBookPage">
      <header>Compendium</header>
      <br />
      Add an entry manually or by searching.
      <hr />
      <button className="cancelBtn" onClick={() => props.toLibrary()}>
        {" "}
        Back to My Compendium{" "}
      </button>
      <p> Search </p>
      <div className="booksearchwrapper">
        <input
          className="searchinput"
          type="text"
          onChange={(e) => searchAPI(e)}
          placeholder="Title, Author, Keyword"
        ></input>
        <ul className="booksearchlist">{searchResults}</ul>
      </div>
      <hr />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const newBook = new Book(
            event.currentTarget.bookTitle.value,
            event.currentTarget.author.value,
            event.currentTarget.year.value,
            event.currentTarget.pages.value,
            event.currentTarget.edition.value,
            uuid(),
          );
          awaitPush(newBook);
          props.toLibrary();
        }}
      >
        <p>Title *</p>
        <input name="bookTitle" type="text" required></input>
        <br />
        <p>Author(s)</p>
        <input name="author" type="text"></input>
        <br />
        <div className="yearpageflex">
          <div className="year">
            <p>Year Published</p>
            <input name="year" type="number"></input>
          </div>
          <div className="page">
            <p>Pages</p>
            <input name="pages" type="number"></input>
          </div>
        </div>
        <br />
        <p>Edition Number/Title</p>
        <input name="edition" type="text"></input>
        <br />
        <div className="flexbuttons">
          <button className="submitBtn" type="submit">
            Submit Entry
          </button>
        </div>
      </form>
    </div>
  );
}
