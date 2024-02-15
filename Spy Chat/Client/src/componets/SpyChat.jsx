import React, { useEffect, createRef, useState, forceUpdate } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Notification from "./notification/notification";
import CryptoJS from "crypto-js";
import Message from "./Message";
import { setTextRange } from "typescript";

function encryptData(text, password) {
  return CryptoJS.AES.encrypt(JSON.stringify(text), password).toString();
}

export default function SpyChat({ username, socket }) {
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(["", 0]);
  const divRef = createRef();

  const sendMessage = () => {
    if (password == "") {
      handleError("Please enter a valid password");
    } else {
      socket.emit("message", encryptData(message, password));
    }
  };

  function handleError(err) {
    setError((old) => {
      return [err, (old[1] += 1)];
    });
  }

  useEffect(() => {
    if (!socket) return;
    socket.emit("username", username);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (message) => {
      setMessages((currentMessages) => currentMessages.concat(message));
    });
  }, [socket]);

  useEffect(() => {
    if (!divRef.current) return;
    divRef.current.scrollTop = divRef.current.scrollHeight;
  }, [divRef]);

  return (
    <>
      <Notification text={error}></Notification>
      <div className="messageBox">
        <h2>Welcome {username}</h2>
        <div className="chatBox" ref={divRef}>
          {messages &&
            messages.map((message, idx) => {
              return (
                <Message
                  key={idx}
                  message={message}
                  error={error}
                  setError={handleError}
                  username={username}
                />
              );
            })}
        </div>
        <input
          className="userInput"
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Message"
          autoComplete="off"
        />
        <FontAwesomeIcon icon={faMessage} className="inputIcon" />
        <br />
        <input
          className="userInput"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          autoComplete="off"
        />
        <FontAwesomeIcon icon={faLock} className="inputIcon" />
        <br />
        <button className="sendButton" onClick={sendMessage}>
          Send
        </button>
      </div>
    </>
  );
}
