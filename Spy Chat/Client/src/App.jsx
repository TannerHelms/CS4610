import { useEffect, useState } from "react";
import "./App.css";
import UsernameBox from "./componets/UsernameBox";
import SpyChat from "./componets/SpyChat";
import { socket } from "./socket";

function App() {
  const [username, setUsername] = useState("");
  const [connection, setConnection] = useState(false);

  useEffect(() => {
    socket.on("connect", (msg) => {
      setConnection(true);
    });

    socket.on("disconnect", () => {
      setConnection(false);
    });
  });

  return !connection ? (
    <p>Connecting to server...</p>
  ) : username ? (
    <SpyChat username={username} />
  ) : (
    <UsernameBox
      submitUsername={(value) => setUsername(value)}
      value={username}
    />
  );
}

export default App;
