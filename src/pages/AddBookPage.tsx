import { ChangeEvent, useState, useContext } from "react";
import { AppContext, AppHeader } from "../App";
import { Book } from "../utilities/Interface";
import { v4 as uuid } from "uuid";
import Swal from "sweetalert2";
import LibraryPage from "./LibraryPage";
import AuthPage from "./AuthPage";
import { uploadBookCall } from "../utilities/API";
import BookNotesPage from "./BookNotesPage";

export default function AddBookPage() {
  const [searchResults, setSearchResults] = useState<React.ReactElement[]>([]);

  //@ts-ignore
  const { setPage, token, setToken } = useContext(AppContext)

  function logoutUser(){
    localStorage.removeItem("token") 
    setToken("")
    setPage(<AuthPage />)
  }

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
            setPage(<BookNotesPage book={book}/>)
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
      
      console.log("AddBook: Done!")

    } catch {
      console.log("App: an error occured in pushBook");
      return false;
    } finally {
      setPage(<LibraryPage />)
    }
    return true;
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

    console.log(dataJSON)

    setSearchResults([]);

    dataJSON.items.forEach((item: any) => {
      let authorString: string = item.volumeInfo.authors[0];
      // const publisher = item.volumeInfo.publisher; (Required for citation feature)
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
                uuid(),
                "",
                item.volumeInfo.publisher
              );
              addBook(newBook);
            }}
          >
            Save to My Compendium
          </button>
        </li>
      );
      setSearchResults((oldSearch) => [...oldSearch, itemElement]);
    });
  }

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    const newBook = new Book(
      event.currentTarget.bookTitle.value,
      event.currentTarget.author.value,
      event.currentTarget.year.value,
      event.currentTarget.pages.value,
      uuid(),
      // Additional Parameters
      event.currentTarget.edition.value,
      event.currentTarget.publisher.value,
      event.currentTarget.container.value,
      event.currentTarget.volume.value,
      event.currentTarget.number.value,
      event.currentTarget.url.value
    );
    // DEBUG
    console.log(newBook)
    await addBook(newBook);
    setPage(<LibraryPage />);
  }

  return (
    <div className="addBookPage">
      <AppHeader></AppHeader>
      <br />
      Add an entry manually or by searching.
      <hr />
      <button className="cancelBtn" onClick={() => setPage(<LibraryPage />)}>
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
        onSubmit={(e) => handleFormSubmit(e)}
      >
        <p>Title *</p>
        <input name="bookTitle" type="text" required></input>
        <br />
        <p>Author(s)</p>
        <input name="author" type="text"></input>
        <br />
        <div className="dualinputflex">
          <div className="left">
            <p>Year Published</p>
            <input name="year" type="number"></input>
          </div>
          <div className="right">
            <p>Pages</p>
            <input name="pages" type="number"></input>
          </div>
        </div>
        <p>Edition / Version</p>
        <input name="edition" type="text"></input>
        <br />
        <div className="dualinputflex">
          <div className="left">
            <p>Publisher</p>
            <input name="publisher" type="text"></input>
          </div>
          <div className="right">
            <p>Container</p>
            <input name="container" type="text"></input>
          </div>
        </div>
        <div className="dualinputflex">
          <div className="left">
            <p>Volume</p>
            <input name="volume" type="text"></input>
          </div>
          <div className="right">
            <p>No.</p>
            <input name="number" type="text"></input>
          </div>
        </div>
        <p>URL</p>
        <input name="url" type="text"></input>
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
