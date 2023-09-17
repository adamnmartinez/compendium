import { Book } from "../components/App";
import { Note } from "../components/App";
import NoteList from "../components/NoteList";

export default function BookNotesPage(props: {book: Book, toLibrary: Function, editNote: Function, renderNotesPage: Function}){

    function deleteNote(note: Note) {
        const newArr = [...props.book.notes]
        const index = newArr.indexOf(note)
        newArr.splice(index, 1)
        props.book.notes = newArr
        props.renderNotesPage(props.book)
    }

    return (
        <>
            <i>{props.book.title}</i> <br />
            {props.book.publishedYear ? ` (${props.book.publishedYear})` : ''} by {props.book.author ? props.book.author : "Unknown"} <br />
            {props.book.pages ? `${props.book.pages} pages` : ""} {props.book.pages ? <br /> : ''}
            <br />
            <button onClick={() => props.toLibrary()}>Back to Library</button>

            <form onSubmit={(event) => {
                event.preventDefault();
                const newNote = new Note(
                    event.currentTarget.noteTitle.value,
                    event.currentTarget.content.value,
                    event.currentTarget.quote.value,
                    event.currentTarget.chapter.value,
                    event.currentTarget.page.value,
                    event.currentTarget.speaker.value,
                );
                props.book.notes.push(newNote)
                console.log(props.book.notes)
                props.renderNotesPage(props.book)
            }}>
                <input name="noteTitle" placeholder="Note Title"></input>
                <br />
                <textarea name="content" placeholder="Your ideas here." required></textarea>
                <br />
                <textarea name="quote" placeholder="Relevant quote(s) here."></textarea>
                <br />
                <input name="chapter" placeholder="Chapter Title/Number"></input>
                <input name="page" placeholder="Page Number"></input>
                <input name="speaker" placeholder="Speaker"></input>
                <br />
                <button type="submit">Save</button>
                <button type="reset">Reset</button>
            </form>
            <hr />
            Notes
            <hr />
            <NoteList book={props.book} list={props.book.notes} deleteNote={deleteNote} editNote={props.editNote} />
        </>
    )
}