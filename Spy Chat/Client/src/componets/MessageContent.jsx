import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import CryptoJS from "crypto-js";

export default function MessageContent({data, onError, onSuccess}) {
    const [clicked, setClicked] = useState(false);
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleClicked = () => {
        onSuccess();
        setClicked(!clicked);
    }

    const handleInputChange = (e) => {
        setPassword(e.target.value);
    }

    const handleBlur = () => {
        if (password != '') {
            handleSubmit();
        } else {
            handleClicked();
        }
    }

    const handleSubmit = () => {
        var message = decryptData(data, password);
        if (message == 'invalid') {
            setClicked(false);
            onError('The provided password was incorrect');
        } else {
            setMessage(message);
        }
        
    }

    function decryptData(text, password) {
        try {
            const bytes = CryptoJS.AES.decrypt(text, password);
            const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return data;
        } catch {
            return 'invalid';
        }
        
    }



    return (
            clicked == false ? 
            <button className="decryptButton" onClick={handleClicked}>Click to Decrypt</button> 
            : message == '' ?
            <>
            <div className="messageContent">
                <input onChange={handleInputChange} onBlur={handleBlur} className="passwordInput" type="text" autoFocus/>
                <FontAwesomeIcon className="m-left" icon={faArrowRight} onClick={handleSubmit}/>
            </div>
            </>
            :
            <p>{message}</p>
    );
}