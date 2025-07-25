import { useState, useContext } from "react";
import { AppContext, AppHeader } from "../App";
import { loginCall, registerCall } from "../utilities/API";
import Swal from "sweetalert2";
import LibraryPage from "./LibraryPage";

export default function AuthPage() {
  const [newUser, setNewUser] = useState<boolean>(false);

  //@ts-ignore
  const { setToken, setIsLoading, setPage } = useContext(AppContext);

  function authenticate(token: string) {
    console.log("AuthPage: User authenticated! Logging them in...");
    console.log("AuthPage: Saving data to local browser storage...");
    localStorage.setItem("token", token);
    setToken(token);
    setPage(<LibraryPage />);
  }

  async function register(username: string, password: string) {
    /*
      Use the LoginCall API method to perform attempt a log-in
    */

    setIsLoading(true);

    try {
      const response = await registerCall(username, password, 10000);
      const data = await response.json();

      if (response.status == 201) {
        // Success
        login(username, password);
        return;
      } else if (response.status == 429) {
        // Rate-Limit
        Swal.fire({
          title: "Slow Down!",
          text: "Too many requests, please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else if (response.status == 408) {
        // Request Timeout
        Swal.fire({
          title: "Request Timed Out!",
          text: "Looks like our servers fell asleep! We'll them up now, try again in a few minutes!",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else if (response.status == 400) {
        // Bad Request
        Swal.fire({
          title: "Bad Credentials!",
          text: data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else if (response.status == 409) {
        // Taken User
        Swal.fire({
          title: "Username Taken!",
          text: "Sorry, looks like that username is taken! Try something else.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        // Other Error
        Swal.fire({
          title: "Unexpected Error!",
          text: "Something went wrong, unexpectedly! Please try again later. If the issue persists, feel free to contact us!",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
    } catch (e) {
      Swal.fire({
        title: "Unexpected Error!",
        text: "Something went wrong, unexpectedly! Please try again later. If the issue persists, feel free to contact us!",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function login(username: string, password: string) {
    /*
      Use the LoginCall API method to perform attempt a log-in
    */

    setIsLoading(true);

    try {
      const response = await loginCall(username, password, 10000);
      const data = await response.json();

      if (response.status == 200) {
        // Success
        authenticate(data.token);
        return;
      } else if (response.status == 429) {
        // Rate-Limit
        Swal.fire({
          title: "Slow Down!",
          text: "Too many requests, please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else if (response.status == 408) {
        // Request Timeout
        Swal.fire({
          title: "Request Timed Out!",
          text: "Looks like our servers fell asleep, try again in a few minutes!",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else if (response.status == 401 || response.status == 400) {
        // Bad Creds
        Swal.fire({
          title: "Login Failed!",
          text: "Your username or password is incorrect!",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        // Other Error
        Swal.fire({
          title: "Unexpected Error!",
          text: "Something went wrong, unexpectedly! Please try again later. If the issue persists, feel free to contact us!",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
    } catch (e) {
      Swal.fire({
        title: "Unexpected Error!",
        text: "Something went wrong, unexpectedly! Please try again later. If the issue persists, feel free to contact us!",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const loginForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const username: string = event.currentTarget.username.value;
        const password: string = event.currentTarget.password.value;
        login(username, password);
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
          register(username, password);
        } else {
          Swal.fire({
            title: "Passwords Mismatch!",
            text: "Make sure both passwords are the same!",
            icon: "error",
            confirmButtonText: "OK",
          });
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
