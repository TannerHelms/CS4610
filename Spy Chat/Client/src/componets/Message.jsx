import { useState } from "react";
import MessageContent from "./MessageContent";
import CryptoJS from "crypto-js";

function Message({ message, error, setError, username }) {
  const [solved, setSolved] = useState(false);
  const [msg, setMsg] = useState("");
  const handlePrompt = () => {
    const key = prompt("Enter Key");
    decryptData(
      message.data,
      key,
      (message) => {
        setMsg(message);
        setSolved(true);
      },
      (error) => setError(error)
    );
  };

  return (
    <>
      <p className="date">{message.date}</p>
      <div className={message.user == username ? "blueMessage" : "greyMessage"}>
        <p>{message.user}</p>
        {solved ? (
          <div>
            <p>{msg}</p>
          </div>
        ) : (
          <button onClick={handlePrompt}>Decrypt Data</button>
        )}
      </div>
    </>
  );
}

export default Message;

function decryptData(text, password, set, error) {
  console.log(`text: ${text}\npassword: ${password}`);
  try {
    const bytes = CryptoJS.AES.decrypt(text, password);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    set(data);
  } catch {
    error("Key was incorrect");
  }
}
