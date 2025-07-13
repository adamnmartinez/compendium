export const timedFetch = (url: string, options: RequestInit, timeout: number): Promise<Response> => {
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
