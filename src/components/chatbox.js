import { useState } from 'react';
import { v4 } from 'uuid';
import './styles.css';
import io from 'socket.io-client'

const socket = io('http://localhost:3000');

const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  socket.on('connect', () => {
    console.log('CONNECTEED!');
  })

  socket.on('chat-message', (messageEvent) => {
    const { id, user, message } = messageEvent;

    setMessages([...messages, { id, message, user }])

    console.log(`New messagse from ${user}: ${message}`);
  });

  const handleWriteMessage = (event) => {
    event.preventDefault();
    setMessage(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const sentMessage = event.target[0].value
    if (sentMessage.trim())
      setMessages([...messages, { id: v4(), message: sentMessage, user: 'self' }])
    socket.emit('chat-message', { id: v4(), message: sentMessage, user: 'other' })
    setMessage('')
  }

  return (
    <div className="ChatContainer">
      <ul className="ChatBox">
        <div id="chat">
          {messages.map(m => (
            <li key={m.id} id={m.user}><span>{m.message}</span></li>
          ))}
        </div>
        <form action="submit" id="messageForm" onSubmit={handleSubmit}>
          <input type="text" id="chatInput" value={message} onChange={handleWriteMessage} />
          <button id="sendMessage">SEND</button>
        </form>
      </ul>
    </div>
  );
}

export default ChatBox;
