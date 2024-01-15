import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMessage} from '@fortawesome/free-solid-svg-icons';
import {faLock} from '@fortawesome/free-solid-svg-icons';
import { socket } from '../socket';
import CryptoJS from "crypto-js";
import MessageContent from './MessageContent';
export default function MessageBox({username}) {
    
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');

    let messageElements = messages.map(function(message) {
        return (
            <div className='messageContainer'>
                <p>{message.user}</p>
                <MessageContent data={message.data} onError={(error) => {setError(error)}} onSuccess={() => {setError('')}}/>
                <p>{message.date}</p>
            </div>
        );
    });

    socket.emit('username', username);

    const handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = () => {
        if (password == '') {
            setError('Please enter a valid password');
        } else {
            setError('');
            socket.emit('message', encryptData(message, password));
        }
        
    }

    socket.on('message', (message) => {setMessages(messages.concat(message))});

    function encryptData(text, password) {
        return CryptoJS.AES.encrypt(
            JSON.stringify(text),
            password
          ).toString();
    }
    
    return (
        <>
        <div className="messageBox">
            <h2>Welcome {username}</h2>
            {error && <p className='error'>Error: {error}</p>}
            <div className="chatBox">
                {messages && messageElements}
            </div>
            <input className='userInput' onChange={handleMessage} type="text" placeholder="Message"/>
            <FontAwesomeIcon icon={faMessage} className='inputIcon'/>
            <br />
            <input className='userInput' onChange={handlePassword} type="password" placeholder="Password"/>
            <FontAwesomeIcon icon={faLock} className='inputIcon'/>
            <br />
            <button className='sendButton' onClick={handleSubmit}>Send</button>
        </div>
        </>
    )
}