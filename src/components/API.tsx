import { HOST } from "../App";

const timedFetch = (url: string, options: RequestInit, timeout: number): Promise<Response> => {
    /*
      A modified fetch function which can return a timeout response
    */
   
    const timeoutPromise = new Promise((resolve, _) =>
        setTimeout(() => resolve(new Response(
          JSON.stringify({
            error: "Request Timed Out",
            data: {
              message: "Request Timeout"
            }
          }), {
            status: 408,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )), timeout)
    );

    return Promise.race([fetch(url, options), timeoutPromise]) as Promise<Response>
}

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

export { timedFetch, loginCall, registerCall }