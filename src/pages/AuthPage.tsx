import { useState } from "react";
import { HOST, fetchUsers } from "../components/App";

export default function AuthPage(props: {
  setAuthenticated: Function;
  setUser: Function;
}) {
  const [newUser, setNewUser] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  function authenticate(user: string) {
    console.log("AuthPage: user authenticated");
    setMessage("Account verified! Logging you in...");
    props.setUser(user);
    props.setAuthenticated(true);
  }

  async function verify(username: string, password: string) {
    console.log("AuthPage: attempting to verify user...");
    const data = await fetchUsers();
    let verified = false;
    data.forEach((user: any) => {
      if (username === user.username && password === user.password) {
        verified = true;
      }
    });
    return verified;
  }

  async function checkUnique(username: string) {
    const data = await fetchUsers();
    let unique = true;
    data.forEach((user: any) => {
      if (username === user.username) {
        unique = false;
      }
    });
    return unique;
  }

  async function addUser(username: string, password: string) {
    await fetch(HOST + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: username,
        pass: password,
      }),
    });
  }

  const loginform = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const username: string = event.currentTarget.username.value;
        const password: string = event.currentTarget.password.value;
        let verified = false;
        verify(username, password).then((result) => {
          verified = result;
          if (!result)
            console.log("AuthPage: could not verify those credentials!");
          verified
            ? authenticate(username)
            : setMessage("Incorrect Username or Password");
        });
        event.currentTarget.password.value = "";
      }}
    >
      Log In
      <input
        name="username"
        defaultValue=""
        placeholder="Username"
        required
      ></input>{" "}
      <br />
      <input
        name="password"
        type="password"
        defaultValue=""
        placeholder="Password"
        required
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

  const registerform = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const username: string = event.currentTarget.username.value;
        const password: string = event.currentTarget.password.value;
        const confirmpass: string = event.currentTarget.confirmpass.value;
        if (password === confirmpass) {
          checkUnique(username).then(function (unique) {
            if (unique) {
              addUser(username, password);
              setMessage("Account Created");
              setNewUser(false);
              event.currentTarget.password.value = "";
            } else {
              setMessage(
                "An error occured: an account with that name already exists.",
              );
            }
          });
        } else {
          setMessage("An error occured: passwords don't match.");
        }
      }}
    >
      Register
      <input
        name="username"
        placeholder="Username"
        defaultValue=""
        required
      ></input>{" "}
      <br />
      <input
        name="password"
        type="password"
        defaultValue=""
        placeholder="Password"
        required
      ></input>{" "}
      <br />
      <input
        name="confirmpass"
        type="password"
        defaultValue=""
        placeholder="Confirm Password"
        required
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
      <header>Compendium</header>
      <p>Please log in or sign up.</p>
      <i>{message}</i>
      <hr />
      {newUser ? registerform : loginform}
    </div>
  );
}
