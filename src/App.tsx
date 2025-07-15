import { createContext, useEffect, useState } from "react";

// Pages
import LibraryPage from "./pages/LibraryPage";
import AuthPage from "./pages/AuthPage";
import Loading from "./components/LoadingOverlay";

// Components
import { Book } from "./utilities/Interface";

export const HOST = 'https://compendium-api-v246.onrender.com'

export function AppHeader(){
  return(
    <>
      <header>Compendium</header>
      by <a className="headerlink" href="https://github.com/adamnmartinez">Adam Martinez</a>
    </>
  )
}

//@ts-ignore
export const AppContext = createContext()

function App() {
  const [user, setUser] = useState<string>("")
  const [currBook, setCurrBook] = useState<Book | null>(null)
  const [currNote, setCurrNote] = useState<Book | null>(null)
  const [library, setLibrary] = useState<Book[]>([])
  const [page, setPage] = useState<React.ReactElement>(<></>)
  const [token, setToken] = useState<string>(localStorage.getItem("token") || "")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const appState = {
    user, setUser,
    currBook, setCurrBook,
    currNote, setCurrNote,
    library, setLibrary,
    page, setPage,
    token, setToken,
    isLoading, setIsLoading
  }

  useEffect(() => {
    (token != "") ? setPage(<LibraryPage />) : setPage(<AuthPage />);
  }, [library]);

  return (
    //@ts-ignore
    <AppContext.Provider value={appState}>
      <div>
        <Loading hidden={!isLoading} />
        <div className="pageWrapper">
          {page}
        </div>
      </div>
    </AppContext.Provider>);
}

export default App;
