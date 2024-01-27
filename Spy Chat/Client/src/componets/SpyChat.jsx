import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { socket } from "../socket";
import CryptoJS from "crypto-js";
import Message from "./Message";

function encryptData(text, password) {
  return CryptoJS.AES.encrypt(JSON.stringify(text), password).toString();
}

export default function SpyChat({ username }) {
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const sendMessage = () => {
    if (password == "") {
      setError("Please enter a valid password");
    } else {
      setError("");
      socket.emit("message", encryptData(message, password));
    }
  };
  socket.on("message", (message) => {
    setMessages(messages.concat(message));
  });

  useEffect(() => {
    socket.emit("username", username);
  }, []);

  return (
    <>
      <div className="messageBox">
        <h2>Welcome {username}</h2>
        {error && <p className="error">Error: {error}</p>}
        <div className="chatBox">
          {messages &&
            messages.map((message, idx) => {
              return (
                <Message
                  key={idx}
                  message={message}
                  error={error}
                  setError={setError}
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
