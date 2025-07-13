import { HOST } from "../App";
import { timedFetch } from "./timedFetch";
import { Book } from "./Interface";

const loginCall = async (username: string, password: string, timeout: number = 10000): Promise<Response> => {
    /*
        Login API Call, 
        Input: Username and Password Strings
        Output: Promise<Response>

        Default timeout after 10 seconds.
    */ 
    try {
        const response = await timedFetch(HOST + "/authenticate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            password: password,
          }), 
        }, timeout)
        return response
    } catch (e) {
        return new Response(
          JSON.stringify({
            error: "Internal Error",
            data: {
              message: e
            }
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
    }
}

const registerCall = async (username: string, password: string, timeout: number = 10000): Promise<Response> => {
    /*
        Register API Call, 
        Input: Username and Password Strings
        Output: Promise<Response>

        Default timeout after 10 seconds.
    */ 
    try {
        const response = timedFetch(HOST + "/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: username,
              password: password
            })
          }, timeout)
        return response
    } catch (e) {
        return new Response(
          JSON.stringify({
            error: "Internal Error",
            data: {
              message: e
            }
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
    }
}

const getLibraryCall = async (token: string, timeout: number = 10000): Promise<Response> => {
    /*
        Register API Call, 
        Input: Username and Password Strings
        Output: Promise<Response>

        Default timeout after 10 seconds.
    */ 
    try {
        const response = timedFetch(HOST + "/account", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: token
            })
          }, timeout)
        return response
    } catch (e) {
        return new Response(
          JSON.stringify({
            error: "Internal Error",
            data: {
              message: e
            }
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
    }
}

const uploadBookCall = async (token: string, book: Book, timeout: number = 10000): Promise<Response> => {
    /*
        Upload Book API Call, 
        Input: Token string and a Book
        Output: Promise<Response>

        Default timeout after 10 seconds.
    */ 
    try {
        const response = timedFetch(HOST + `/account/library/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: token,
            book: book
          }),
        }, timeout)

        return response

    } catch (e) {
        return new Response(
          JSON.stringify({
            error: "Internal Error",
            data: {
              message: e
            }
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
    }
}

const deleteBookCall = async (token: string, book: Book, timeout: number = 10000): Promise<Response> => {
    /*
        Register API Call, 
        Input: Username and Password Strings
        Output: Promise<Response>

        Default timeout after 10 seconds.
    */ 
    try {
        const response = timedFetch(HOST + `/account/library/remove`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: token,
              uuid: book.uuid
            })
          }, timeout)
        return response
    } catch (e) {
        return new Response(
          JSON.stringify({
            error: "Internal Error",
            data: {
              message: e
            }
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
    }
}

const modifyBookCall = async (token: string, old: Book, modified: Book, timeout: number = 10000): Promise<Response> => {
    /*
        Register API Call, 
        Input: Username and Password Strings
        Output: Promise<Response>

        Default timeout after 10 seconds.
    */ 
    try {
      const response = timedFetch(HOST + `/account/library/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          uuid: old.uuid,
          modified: modified
        }),
      }, timeout)
        return response
    } catch (e) {
        return new Response(
          JSON.stringify({
            error: "Internal Error",
            data: {
              message: e
            }
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
    }
}



export { loginCall, registerCall, getLibraryCall, uploadBookCall, deleteBookCall, modifyBookCall }