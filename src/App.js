// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // Fetch token on component mount (login)
    axios.post('/api/login', { username, password })
      .then(response => setToken(response.data.token))
      .catch(error => console.error(error));
  }, [username, password]);

  const sendMessage = async () => {
    const to = 'recipient-username';
    const text = 'your-plain-text-message';

    // Encrypt the message using CryptoJS
    const encryptedText = CryptoJS.AES.encrypt(text, 'your-secret-key').toString();

    try {
      // Send the encrypted message to the server
      await axios.post('/api/send-message', { to, text: encryptedText }, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <div>
      <h1>MERN Stack Encrypted Chat</h1>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={sendMessage}>Send Encrypted Message</button>
    </div>
  );
};

export default App;
