import { useState } from "react";
import { AppHeader } from "../App";
import { loginCall, registerCall } from "../components/API";
import Swal from "sweetalert2";

export default function AuthPage(props: {
  setToken: Function;
  setLoading: Function;
}) {
  const [newUser, setNewUser] = useState<boolean>(false);

  function authenticate(token: string) {
    console.log("AuthPage: User authenticated! Logging them in...");
    console.log("AuthPage: Saving data to local browser storage...")
    localStorage.setItem("token", token)
    props.setToken(token);
  }

  async function register(username: string, password: string){
    /*
      Use the LoginCall API method to perform attempt a log-in
    */

    props.setLoading(true)

    try {
      const response = await registerCall(username, password, 10000)
      const data = await response.json()
      console.log(`${response.status} ${data.message}`)

      if (response.status == 201){
        // Success
        login(username, password)
        authenticate(data.token)
        return
      } else if (response.status == 429){
        // Rate-Limit
        Swal.fire({
          title: 'Slow Down!',
          text: 'Too many requests, please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } else if (response.status == 408){
        // Request Timeout
        Swal.fire({
          title: 'Request Timed Out!',
          text: 'Looks like our servers fell asleep, try again in about 10 minutes!',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } else if (response.status == 400){
        // Bad Request
        Swal.fire({
          title: "Bad Request!",
          text: data.message,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } else if (response.status == 409){
        // Taken User
        Swal.fire({
          title: "Username Taken!",
          text: "Sorry, looks like that username is taken! Try something else.",
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } else {
        // Other Error
        Swal.fire({
          title: "Unexpected Error!",
          text: 'Something went wrong, unexpectedly! Please try again later. If the issue persists, feel free to contact us!',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return
      }
    } catch (e) {
      console.log(e)
      Swal.fire({
        title: "Unexpected Error!",
        text: 'Something went wrong, unexpectedly! Please try again later. If the issue persists, feel free to contact us!',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    } finally {
      props.setLoading(false)
    }
  }

  async function login(username: string, password: string) {
    /*
      Use the LoginCall API method to perform attempt a log-in
    */

    props.setLoading(true)

    try {
      const response = await loginCall(username, password, 10000)
      const data = await response.json()
      console.log(`${response.status} ${data.message}`)

      if (response.status == 200){
        // Success
        authenticate(data.token)
        return
      } else if (response.status == 429){
        // Rate-Limit
        Swal.fire({
          title: 'Slow Down!',
          text: 'Too many requests, please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } else if (response.status == 408){
        // Request Timeout
        Swal.fire({
          title: 'Request Timed Out!',
          text: 'Looks like our servers fell asleep, try again in about 10 minutes!.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } else if (response.status == 401){
        // Bad Creds
        Swal.fire({
          title: "Login Failed!",
          text: 'Your username or password is incorrect!',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } else {
        // Other Error
        Swal.fire({
          title: "Unexpected Error!",
          text: 'Something went wrong, unexpectedly! Please try again later. If the issue persists, feel free to contact us!',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return
      }
    } catch (e) {
      console.log(e)
      Swal.fire({
        title: "Unexpected Error!",
        text: 'Something went wrong, unexpectedly! Please try again later. If the issue persists, feel free to contact us!',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    } finally {
      props.setLoading(false)
    }
  }

  const loginForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const username: string = event.currentTarget.username.value;
        const password: string = event.currentTarget.password.value;
        login(username, password)
        event.currentTarget.password.value = "";
        
      }}
    >
      Log In
      <input
        name="username"
        defaultValue=""
        placeholder="Username"
        required
        className="usernameInput"
      ></input>{" "}
      <br />
      <input
        name="password"
        type="password"
        defaultValue=""
        placeholder="Password"
        required
        className="passwordInput"
      ></input>{" "}
      <br />
      <button className="submitBtn" type="submit">
        {" "}
        Log In{" "}
      </button>{" "}
      <br />
      <button type="button" onClick={() => setNewUser(true)}>
        {" "}
        New to Compendium? Click here to register
      </button>{" "}
      <br />
    </form>
  );

  const registerForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const username: string = event.currentTarget.username.value;
        const password: string = event.currentTarget.password.value;
        const confirmpass: string = event.currentTarget.confirmpass.value;
        if (password === confirmpass) {
          register(username, password)
        } else {
          Swal.fire({
            title: "Passwords Mismatch!",
            text: 'Make sure both passwords are the same!',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
      }}
    >
      Register
      <input
        name="username"
        placeholder="Username"
        defaultValue=""
        required
        className="usernameInput"
      ></input>{" "}
      <br />
      <input
        name="password"
        type="password"
        defaultValue=""
        placeholder="Password"
        required
        className="passwordInput"
      ></input>{" "}
      <br />
      <input
        name="confirmpass"
        type="password"
        defaultValue=""
        placeholder="Confirm Password"
        required
        className="passwordInput"
      ></input>{" "}
      <br />
      <button className="submitBtn" type="submit">
        {" "}
        Create Account{" "}
      </button>{" "}
      <br />
      <button type="button" onClick={() => setNewUser(false)}>
        {" "}
        Already registered? Click here to Log In
      </button>{" "}
      <br />
    </form>
  );

  return (
    <div className="authPage">
      <AppHeader></AppHeader>
      <p>Please log in or sign up.</p>
      <hr />
      {newUser ? registerForm : loginForm}
    </div>
  );
}
