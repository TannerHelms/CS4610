import React, { useState } from 'react';

export default function UsernameBox({ submitUsername }) {

  const [username, setUsername] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  const handleUsernameSubmit = () => {
    submitUsername(username);
  }

  return (
    <div className="usernameBox">
        <h2>Welcome to Spy Chat</h2>
        <p>Please enter a username to continue</p>
        <input onChange={handleUsernameChange} type="text" placeholder="Username"/>
        <br />
        <button onClick={handleUsernameSubmit}>Submit</button>
    </div>
  )
}

