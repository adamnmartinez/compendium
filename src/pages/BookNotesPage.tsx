import { Book, Note } from "../utilities/Interface";
import { ChangeEvent, useState, useEffect, useContext } from "react";
import { HOST } from "../App";
import { v4 as uuid } from "uuid";
import NoteList from "../components/NoteList";
import { AppContext } from "../App";
import AuthPage from "./AuthPage";
import EditBookPage from "./EditBookPage";
import LibraryPage from "./LibraryPage";
import Swal from "sweetalert2";
import { uploadNoteCall, deleteNoteCall } from "../utilities/API";
import EditNotePage from "./EditNotePage";

export default function BookNotesPage(props: {
  book: Book;
}) {
  const [formVis, setFormVis] = useState<Boolean>(false);
  const [citeVis, setCiteVis] = useState<Boolean>(false);
  const [style, setStyle] = useState<string>("")
  const [citation, setCitation] = useState(<>Click "Generate" to create a citation.</>);
  const [noteQuery, setNoteQuery] = useState<string>("");
  const [usernotes, setUsernotes] = useState<Note[]>([]);

  // Citations
  const [showPageCount, setShowPageCount] = useState<boolean>(false)
  const [pageCount, setPC] = useState<string>("")
  const [periodical, setPeriodical] = useState<boolean>(false)
  const [showURL, setShowURL] = useState<boolean>(false)
  const [showAccessDate, setShowAccessDate] = useState<boolean>(false)
  const [accessDate, setAccessDate] = useState<string>("")

  //@ts-ignore
  const { token, setToken, setPage } = useContext(AppContext)
    
  function logoutUser(){
    localStorage.removeItem("token") 
    setToken("")
    setPage(<AuthPage />)
  }

  function formToggle(): void {
    formVis ? setFormVis(false) : setFormVis(true);
    setCiteVis(false)
  }

  function citeToggle(): void {
    citeVis ? setCiteVis(false) : setCiteVis(true)
    setFormVis(false)
  }

  async function addNote(book: Book, note: Note): Promise<Boolean> {
    try {
      const response = await uploadNoteCall(token, book, note)
      if (response.status == 200) {
        Swal.fire({
          title: 'Note Added!',
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
      console.log("App: an error occured in addNote");
      return false;
    }
    return true;
  }

  async function delNote(book: Book, note: Note) {
    try {
      const response = await deleteNoteCall(token, book, note)
      if (response.status == 200) {
        Swal.fire({
          title: 'Note Deleted!',
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
      console.log("App: an error occured in delNote");
      return false;
    }
    return true;
  }

  function renderNoteList() {
    console.log(`BookNotes: rendering notelist for \"${props.book.title}\"...`);
    try {
      fetch(HOST + "/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token
        })
      }).then((response) => response.json()).then((data) => {
        let requestedBook = null

        for (let i = 0; i < data.library.length; i++){
          if (data.library[i].uuid == props.book.uuid) {
            requestedBook = data.library[i]
            break;
          }
        }

        if (!requestedBook) {
          setUsernotes([new Note("404","Entries could not be updated, please log in again.", "", "", 0, "", "",)])
          return
        }

        setUsernotes([])

        let notesfromuser: Note[] = [];

        for (let i = 0; i < requestedBook.notes.length; i++) {
          notesfromuser.push(requestedBook.notes[i])
        }

        setUsernotes(notesfromuser);
      })
    } catch (e) {
      console.log("BookNotes: an error occured while getting user data");
      console.error(e)
      setUsernotes([new Note("500","Page Error Occured", "", "", 0, "", "",)])
      return
    }
  }

  function handleSearch(event: ChangeEvent): void {
    const target = event.currentTarget as HTMLInputElement;
    setNoteQuery(target.value);
  }

  function handleStyleSelect(event: ChangeEvent): void {
    const target = event.currentTarget as HTMLInputElement;
    setStyle(target.value)
  }

  function handlePCSelect(event: ChangeEvent): void {
    const target = event.currentTarget as HTMLInputElement;
    setShowPageCount(target.checked)
  }

  function handlePC(event: ChangeEvent): void {
    const target = event.currentTarget as HTMLInputElement
    setPC(target.value)
  }

  function handleAD(event: ChangeEvent): void {
    const target = event.currentTarget as HTMLInputElement
    const dateArray = target.value.split("-")

    var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    const year = dateArray [0]
    const month = parseInt(dateArray[1])
    const day = dateArray[2]

    setAccessDate(`${day} ${months[month - 1]} ${year}`)
  }

  function handleShowAccessDate(event: ChangeEvent): void {
    const target = event.currentTarget as HTMLInputElement;
    setShowAccessDate(target.checked)
    if (target.checked == false) {
      setAccessDate("")
    }
  }

  function handleShowURL(event: ChangeEvent): void {
    const target = event.currentTarget as HTMLInputElement
    setShowURL(target.checked)
    const bk = props.book
    if (target.checked && (bk.url == "")) {
        Swal.fire({
          title: 'Citation Warning',
          text: `You are requesting a URL for your citation, but no URL is present on this entry. Would you like to edit this entry to set these values?`,
          confirmButtonText: 'Yes, edit this entry.',
          denyButtonText: `No, continue with the citation.`,
          showDenyButton: true,
          icon: 'question',
        }
      ).then((result) => {
        if (result.isConfirmed) {
          setPage(<EditBookPage book={props.book}></EditBookPage>)
        }
      })

    }
  }

  function handlePeriodicalSelect(event: ChangeEvent): void {
    const target = event.currentTarget as HTMLInputElement
    setPeriodical(target.checked)

    const bk = props.book
    if (target.checked && (bk.container == "" || bk.volume <= 0 || bk.number <= 0)) {
        Swal.fire({
          title: 'Citation Warning',
          text: `You are requesting a periodical citation, but at least one of the container (i.e. journal), volume, or number is not set. This will likely result in an incomplete citation. Would you like to edit this entry to set these values?`,
          confirmButtonText: 'Yes, edit this entry.',
          denyButtonText: `No, continue with the citation.`,
          showDenyButton: true,
          icon: 'question',
        }
      ).then((result) => {
        if (result.isConfirmed) {
          setPage(<EditBookPage book={props.book}></EditBookPage>)
        }
      })

    }
  }

  function generateCitation(): void {
    let bk = props.book

    const authorName = bk.author.split(" ")
    const authorLN = authorName[1]
    const authorFN = authorName[0]

    if (style == "None") {
      setCitation(<>Select a style to continue.</>)
      return
    } else if (style == "MLA") {
      setCitation(periodical ? 
        <>
          {authorLN}, {authorFN}. "{bk.title}." <i>{bk.container ? bk.container + ", " : ", Unknown Journal"}</i>
          {bk.volume > 0 ? "vol. " + bk.volume + ", " : ""}{bk.number > 0 ? "no. " + bk.volume + ", " : ""}
          {bk.publishedYear || 'Unknown Year'}
          {showPageCount && pageCount != "" ? `, pp. ${pageCount}` : ``}
          {showURL && bk.url != "" ? `, ${bk.url}.` : `.`}
          {showAccessDate && accessDate != "" ? ` Accessed ${accessDate}.`: ``}
        </> : <>
          {authorLN}, {authorFN}. <i>{bk.title}. </i>{bk.edition ? bk.edition + ", " : ""}
          {bk.publisher ? bk.publisher + ", " : ""}
          {bk.publishedYear || 'Unknown Year'}
          {showPageCount && pageCount != "" ? `, pp. ${pageCount}` : ``}
          {showURL && bk.url != "" ? `, ${bk.url}.` : `.`}
          {showAccessDate && accessDate != "" ? ` Accessed ${accessDate}.`: ``}
        </>)
    } else if (style == "APA") {
      setCitation(<>Thanks for showing interest in this feature! It's not done yet, but it will be soon, thanks for your patience!</>)
    } else if (style == "Chicago") {
      setCitation(<>Thanks for showing interest in this feature! It's not done yet, but it will be soon, thanks for your patience!</>)
    } else {
      setCitation(<>Select a style to continue.</>)
    }
    
  }

  useEffect(() => {
    renderNoteList();
  }, []);

  return (
    <div className="bookNotesPage">
      <div className="bookInfo">
        <span className="bookTitle">
          <i>{props.book.title}</i>{" "}
          {props.book.publishedYear ? ` (${props.book.publishedYear})` : ""}
        </span>{" "}
        <br />
        by {props.book.author ? props.book.author : "Unknown"} <br />
        {props.book.pages ? `${props.book.pages} pages` : ""}{" "}
        {props.book.pages ? <br /> : ""}
        {props.book.container ? 
          <div className="additionalData">
            <i className="infoHeader">Source</i>
            <br></br>
            {props.book.container}
            {props.book.volume > 0 ? `, Vol. ${props.book.volume}` : ``}
            {props.book.number > 0 ? `, No. ${props.book.number}` : ``} 
            <br />
          </div>
        : ""}
        {props.book.edition ? 
          <div className="additionalData">
            <i className="infoHeader">Edition</i>
            <br></br>
            {props.book.edition} 
            <br />
          </div>
        : ""}
        {props.book.publisher ? 
          <div className="additionalData">
            <i className="infoHeader">Publisher</i>
            <br></br>
            {props.book.publisher} 
            <br />
          </div>
        : ""}
      </div>
      <br />
      <button className={citeVis ? "revealForm revealed" : "revealForm"} onClick={citeVis ? () => {}: citeToggle}>
        {citeVis ? '' : 'Cite This Source'}
        <form
          className="citationForm"
          style={citeVis ? { display: "block" } : { display: "none" }}
          onSubmit={(event) => { event.preventDefault(); }}
        >
          Select citations style: <br/>
          <select onChange={handleStyleSelect}>
            <option value={"None"}> Select a Style</option>
            <option value={"MLA"}> MLA </option>
            <option value={"Chicago"}> Chicago </option>
            <option value={"APA"}> APA </option>
          </select>
          <br />
          { style == "MLA" ? <><input onChange={(e) => handlePCSelect(e)} className="checkbox" type="checkbox"/><label>Include Pages</label></>: ""}
          { style == "MLA" ? <><input onChange={(e) => handlePeriodicalSelect(e)} className="checkbox" type="checkbox"/><label>Is Periodical</label></>: ""}
          { style == "MLA" ? <><input onChange={(e) => handleShowURL(e)} className="checkbox" type="checkbox"/><label>Include Entry URL</label></>: ""}
          { style == "MLA" ? <><input onChange={(e) => handleShowAccessDate(e)} className="checkbox" type="checkbox"/><label>Include Accessed Date</label></>: ""}
          { style == "MLA" && showPageCount ? <input className="citationTextInput" placeholder="Page Count (12, 13, 14, 36-39, etc.)" onChange={(e) => handlePC(e)}></input> : ""}
          { style == "MLA" && showAccessDate ? <input className="citationTextInput" type="date" onChange={(e) => handleAD(e)}></input> : ""}
          <button className="generateBtn" onClick={generateCitation}>Generate</button>
          <div className="citation" hidden={citation == <></>}>
            {citation}
          </div>
          <button onClick={() => setCiteVis(false)}>Close</button>
        </form>
      </button>
      
      <button className={formVis ? "revealForm revealed" : "revealForm"}  onClick={formToggle}>
        Make a Note +
      </button>
      <form
        className="noteForm"
        style={formVis ? { display: "block" } : { display: "none" }}
        onSubmit={(event) => {
          event.preventDefault();
          const newNote = new Note(
            event.currentTarget.noteTitle.value,
            event.currentTarget.content.value,
            event.currentTarget.quote.value,
            event.currentTarget.chapter.value,
            event.currentTarget.page.value,
            event.currentTarget.speaker.value,
            uuid(),
          );
          addNote(props.book, newNote);
          formToggle();
          setTimeout(() => {
            renderNoteList();
          }, 500);
        }}
      >
        <input name="noteTitle" placeholder="Note Title" required></input>
        <br />
        <div className="ideaquoteflex">
          <textarea
            name="content"
            className="contentinput"
            placeholder="Your ideas here. *"
          ></textarea>
          <textarea name="quote" placeholder="Relevant text here."></textarea>
        </div>
        <div className="pagechapterflex">
          <input
            className="chapterinput"
            name="chapter"
            placeholder="Chapter/Part/Section"
          ></input>
          <input name="page" type="number" placeholder="Page Number"></input>
        </div>
        <input name="speaker" placeholder="Speaker"></input>
        <br />
        <div className="flexbuttons">
          <button className="confirmBtn" type="submit">
            Save
          </button>
          <button className="closeBtn" type="button" onClick={formToggle}>
            Close
          </button>
          <button className="resetBtn" type="reset">
            Clear
          </button>
        </div>
      </form>
      <button className="tolibrary" onClick={() => setPage(<LibraryPage />)}>
        Back to My Compendium
      </button>
      <hr />
      <input placeholder={"Search for notes"} onChange={handleSearch}></input>
      <NoteList
        deleteNote={delNote}
        editNote={(note: Note, book: Book) => setPage(<EditNotePage book={book} note={note}/>)}
        renderNoteList={renderNoteList}
        query={noteQuery}
        book={props.book}
        list={usernotes}
      />
    </div>
  );
}
