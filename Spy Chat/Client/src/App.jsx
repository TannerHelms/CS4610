import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UsernameBox from './componets/usernameBox'
import MessageBox from './componets/MessageBox'

function App() {
  const [username, setUsername] = useState('');

  const handleUsernameChange = (value) => {
    setUsername(value);
  }

  return (
    <>
            <div>
              {username && ( <MessageBox username= {username} /> )}
              {!username && ( <UsernameBox submitUsername={(value) => handleUsernameChange(value)}/> )}
            </div>
    </>
  )
}

export default App
