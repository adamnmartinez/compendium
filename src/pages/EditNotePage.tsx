import { Book } from "../components/App";
import { Note } from "../components/App";

export default function EditNotePage(props: {note: Note, book: Book, toBookNotes: Function}){
    return (
        <>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    props.note.title = event.currentTarget.noteTitle.value 
                    props.note.content = event.currentTarget.content.value
                    props.note.quote = event.currentTarget.quote.value
                    props.note.chapter = event.currentTarget.chapter.value
                    props.note.page = event.currentTarget.page.value
                    props.note.speaker = event.currentTarget.speaker.value
                    props.toBookNotes(props.book)
                }}
            >
            <input
                name="noteTitle"
                type="text"
                defaultValue={props.note.title}
                placeholder="Note Title"
            ></input> 
            <br />
            <textarea
                name="content"
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
            <br />
            <input
                name="chapter"
                type="text"
                placeholder="Chapter Title/Number"
                defaultValue={props.note.chapter}
            ></input>
            <input
                name="page"
                type="number"
                placeholder="Page Number"
                defaultValue={props.note.page}
            ></input>
            <input
                name="speaker"
                type="text"
                placeholder="Speaker"
                defaultValue={props.note.speaker}
            ></input>
            <br />
            <button type="submit">Save</button>
            <button type="button" onClick={() => props.toBookNotes(props.book)}>Cancel</button>
            </form>
        </>
    )
}

    