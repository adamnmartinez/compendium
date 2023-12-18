import { Book } from "../components/App";
import { Note } from "../components/App";

export default function EditNotePage(props: {
  note: Note;
  book: Book;
  toBookNotes: Function;
  editFunc: Function;
}) {
  async function awaitNoteEdit(newnote: Note) {
    console.log("EditNotePage: loading...");
    try {
      await props.editFunc(props.book, props.note, newnote);
    } catch {
      `EditNotePage: An error occured in awaitNoteEdit while modifying note from \"${props.book.title}\"`;
    }
    console.log(
      `EditNotePage: successfully modified note from \"${props.book.title}\"`,
    );
  }

  return (
    <div className="noteEditPage">
      <div className="bookInfo">
        <span className="bookTitle">
          <i>{props.book.title}</i>{" "}
          {props.book.publishedYear ? ` (${props.book.publishedYear})` : ""}
        </span>{" "}
        <br />
        by {props.book.author ? props.book.author : "Unknown"} <br />
        {props.book.pages ? `${props.book.pages} pages` : ""}{" "}
        {props.book.pages ? <br /> : ""}
        {props.book.edition ? `Edition ${props.book.edition}` : ""}{" "}
        {props.book.edition ? <br /> : ""}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const updatedNote = new Note(
            event.currentTarget.noteTitle.value,
            event.currentTarget.content.value,
            event.currentTarget.quote.value,
            event.currentTarget.chapter.value,
            event.currentTarget.page.value,
            event.currentTarget.speaker.value,
            props.note.uuid,
          );
          awaitNoteEdit(updatedNote);
          //props.toBookNotes(props.book);
          //setTimeout(() => props.toBookNotes(props.book), 500);
        }}
      >
        <input
          name="noteTitle"
          type="text"
          defaultValue={props.note.title}
          placeholder="Note Title"
        ></input>
        <br />
        <div className="ideaquoteflex">
          <textarea
            name="content"
            className="contentinput"
            placeholder="Note Content"
            defaultValue={props.note.content}
            required
          ></textarea>
          <br />
          <textarea
            name="quote"
            placeholder="Quote(s)"
            defaultValue={props.note.quote}
          ></textarea>
        </div>
        <div className="pagechapterflex">
          <input
            name="chapter"
            type="text"
            className="chapterinput"
            placeholder="Chapter Title/Number"
            defaultValue={props.note.chapter}
          ></input>
          <input
            name="page"
            type="number"
            placeholder="Page Number"
            defaultValue={props.note.page}
          ></input>
        </div>
        <input
          name="speaker"
          type="text"
          placeholder="Speaker"
          defaultValue={props.note.speaker}
        ></input>
        <br />
        <div className="flexbuttons">
          <button className="submitBtn" type="submit">
            Save
          </button>
          <button
            className="cancelBtn"
            type="button"
            onClick={() => props.toBookNotes(props.book)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
