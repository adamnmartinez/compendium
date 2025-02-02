import { useState } from "react";
import { AppHeader, HOST } from "../App";

export default function AuthPage(props: {
  setToken: Function;
}) {
  const [newUser, setNewUser] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [msgcolor, setMsgColor] = useState<string>("");

  const errorColor = "darkred";
  const defaultColor = "black";
  const successColor = "darkgreen";

  function authenticate(token: string) {
    console.log("AuthPage: user authenticated");
    setMsgColor(successColor);
    setMessage("Account verified! Logging you in...");

    console.log("Setting Local Storage")
    localStorage.setItem("token", token)
    props.setToken(token);
  }

  async function register(username: string, password: string){
    console.log("AuthPage: Starting registration")
    try{
          fetch(HOST + "/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: username,
              password: password
            })
          }).then((response) => {
            response.json().then((data) => {
              console.log(response.status + " " + data.message)
              if (response.status == 201){
                login(username, password)
              } else {
                setMsgColor(errorColor);
                setMessage("Invalid credentials, please try again.")
                return
              }
            })
          })
      } catch (e) {
        console.log(e)
        setMsgColor(errorColor);
        setMessage("An error occured creating you account. Please try again later.")
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
      .then((response) => {
        response.json().then((data) => {
          console.log(response.status + " " + data.message)
          if (response.status == 200){
            setMsgColor(successColor)
            setMessage("Login Success!")
            authenticate(data.token)
            return
          } else if (response.status == 429){
            setMsgColor(errorColor);
            setMessage("Too many requests, please try again later.")
          } else {
            setMsgColor(errorColor);
            setMessage("Invalid credentials, please try again.")
            return
          }
        })
      })
    } catch(e) {
      console.log(e)
      setMsgColor(errorColor);
      setMessage("An error occured logging you in. Please try again later.")
    }
  }

  const loginform = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const username: string = event.currentTarget.username.value;
        const password: string = event.currentTarget.password.value;
        setMsgColor(defaultColor);
        setMessage("Logging you in (Please allow up to 15 minutes for the server to spin up)...")
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
          setMsgColor(defaultColor);
          setMessage("Creating Account...")
          register(username, password)
        } else {
          setMsgColor(errorColor);
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
      <p><i>Thank you for your interest in Compendium! This site is currently undergoing some renovations, and may not work as intended!</i></p>
      <p>Please log in or sign up.</p>
      <i style={{color: msgcolor}}>{message}</i>
      <hr />
      {newUser ? registerform : loginform}
    </div>
  );
}
