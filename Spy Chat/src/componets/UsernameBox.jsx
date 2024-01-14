import React, { useState } from 'react';

export default function UsernameBox({ submit }) {

  const [username, setUsername] = useState("Submit");

  return (
    <div className="usernameBox">
        <h2>Welcome to Spy Chat</h2>
        <p>Please enter a username to continue</p>
        <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username"/>
        <br />
        <button onClick={submit()}>Submit</button>
    </div>
  )
}

