import React, { useEffect, createRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import CryptoJS from "crypto-js";
import Message from "./Message";

function encryptData(text, password) {
  return CryptoJS.AES.encrypt(JSON.stringify(text), password).toString();
}

export default function SpyChat({ username, socket }) {
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const divRef = createRef();

  const sendMessage = () => {
    if (password == "") {
      setError("Please enter a valid password");
    } else {
      setError("");
      socket.emit("message", encryptData(message, password));
    }
  };

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
      <div className="messageBox">
        <h2>Welcome {username}</h2>
        {error && <p className="error">Error: {error}</p>}
        <div className="chatBox" ref={divRef}>
          {messages &&
            messages.map((message, idx) => {
              return (
                <Message
                  key={idx}
                  message={message}
                  error={error}
                  setError={setError}
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
        />
        <FontAwesomeIcon icon={faMessage} className="inputIcon" />
        <br />
        <input
          className="userInput"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
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
