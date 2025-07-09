
export default function Loading(props: {hidden: boolean}) {
    return (
        <div className="loadingscreen" style={{opacity: props.hidden ? 0 : 1, visibility: props.hidden ? "hidden" : "visible"}}>
            <div className="dimmer"></div>
            <div className="loadingicon">
                <img src="src\assets\bmo.gif"></img>
                <p>Loading...</p>
            </div>
        </div>
    )
}

function SmallLoading(props: {hidden: boolean}) {
    return (
        <div className="loadingscreen" hidden={props.hidden}>
            <div className="loadingicon">
                <img src="src\assets\bmo.gif"></img>
                <p>Loading...</p>
            </div>
        </div>
    )
}

export { SmallLoading }