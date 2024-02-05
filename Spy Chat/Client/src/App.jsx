import { useEffect, useState } from "react";
import "./App.css";
import UsernameBox from "./componets/UsernameBox";
import SpyChat from "./componets/SpyChat";
import { io } from "socket.io-client";

export default function App() {
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io();
    setSocket(s);
    return () => {
      s.disconnect;
      setSocket(null);
    };
  }, []);

  if (!socket) return <p>Connecting to server...</p>;

  if (username) return <SpyChat username={username} socket={socket} />;

  return (
    <UsernameBox
      submitUsername={(value) => setUsername(value)}
      value={username}
    />
  );
}
