import { useState } from "react";
import { AppHeader, HOST } from "../components/App";
import { v4 as uuid } from "uuid"

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

  async function register(id: string, username: string, password: string){
    console.log("AuthPage: Starting registration")
    
    await fetch(HOST + "/userExists?", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username
      }),
    }).then((response) => response.json()).then(data => {
      if (data.exists){
        setMessage("An account with that username already exists")
        return
      }
    })

    try{
      await fetch(HOST + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          password: password,
          username: username
        })
      })
    } catch (e) {
      console.log(e)
      setMessage("An error occured creating your account...")
    } finally {
      authenticate(username)
    } 
  }

  async function login(username: string, password: string) {
    try {
      await fetch(HOST + "/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }), 
      })
      .then((response) => response.json())
      .then(data => {
        if(data.valid) {
          setMessage("Login Success!")
          authenticate(username)
        } else {
          setMessage("Invalid credentials, please try again.")
        }
      })
    } catch(e) {
      console.log(e)
      setMessage("An error occured logging you in...")
    }
  }

  const loginform = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const username: string = event.currentTarget.username.value;
        const password: string = event.currentTarget.password.value;
        setMessage("Logging you in...")
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
          if (username.length < 6){
            setMessage(
              "Your username and password must have 6 or more characters.",
            );
          }
          else if (password.length < 6){
            setMessage(
              "Your username and password must have 6 or more characters.",
            );
          } else {
            setMessage("Creating Account...")
            register(uuid(), username, password)
          }
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
      <AppHeader></AppHeader>
      <p>Please log in or sign up.</p>
      <i>{message}</i>
      <hr />
      {newUser ? registerform : loginform}
    </div>
  );
}
