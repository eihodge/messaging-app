import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './MessagingPage.css';
import sendIcon from './sendIcon.png'; 

const MessagingPage = () => {
  const location = useLocation();
  const { username, receiverUsername } = location.state || {};

  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [lastMessageSent, setLastMessageSent] = useState(null);

  // Reference to message container used to scroll to bottom on default
  const messagesEndRef = useRef(null);


  // Handle textarea content changes
  const handleTextareaChange = (event) => {
    setMessageContent(event.target.value);
  };

  // Handle message sending
  const handleSendMessage = async () => {
    if (messageContent.trim() !== '') {
      try {
        const response = await fetch('http://127.0.0.1:5000/send_message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender_id: senderId,
            receiver_id: receiverId,
            content: messageContent.trim(),
          }),
        });

        if (response.ok) {
          setMessageContent(''); // Clear the textarea
          setLastMessageSent(new Date().toISOString()); // Trigger a re-fetch of messages
        } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        alert("Error: Failed to send message. ", error); 
      }
    }
  };

  // Fetch user IDs and messages when component mounts or when `lastMessageSent` changes
  useEffect(() => {
    const fetchID = async (username) => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/user/${username}`);
        if (response.ok) {
          const data = await response.json();
          return data.id;
        } else {
          console.error("Failed to fetch a username");
        }
      } catch (error) {
        console.error("Failed to fetch users: ", error);
      }
      return null;
    };

    const fetchMessages = async () => {
      try {
        const fetchedSenderId = await fetchID(username);
        const fetchedReceiverId = await fetchID(receiverUsername);

        setSenderId(fetchedSenderId);
        setReceiverId(fetchedReceiverId);

        if (fetchedSenderId && fetchedReceiverId) {
          const response = await fetch(
            `http://127.0.0.1:5000/get_all_messages/${fetchedSenderId}/${fetchedReceiverId}`
          );
          if (response.ok) {
            const data = await response.json();
            setMessages(data);
          } else {
            console.error("Failed to fetch messages.");
          }
        } else {
          console.error("Failed to fetch sender or receiver ID.");
        }
      } catch (error) {
        console.error("Failed to fetch messages: ", error);
      }
    };

    // Fetch messages initially when component mounts
    if (username && receiverUsername) {
      fetchMessages();
    }
  }, [lastMessageSent]); // Dependencies include `lastMessageSent` for re-fetch after sending a message

  // poll for new messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (username && receiverUsername) {
        fetch(`http://127.0.0.1:5000/get_all_messages/${senderId}/${receiverId}`)
          .then((response) => response.json())
          .then((data) => setMessages(data))
          .catch((error) => console.error("Error fetching messages:", error));
      }
    }, 1000); // 3000 = 3 seconds

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(interval);
  }, [username, receiverUsername, senderId, receiverId]);

  // Scroll to the bottom when the messages changes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

    // Handle the "Enter" key press to send message
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        // prevent creating a new line if the enter key is pressed without holding down shift
        event.preventDefault();
        handleSendMessage();
      }
    };

  return (
    <div className="messagesApp">
      <div className="messagesHeader">
        <p className="headerText">Message</p>
      </div>

      <div className="messagesAndTextareaBox">
        <div className="messagesBox" ref={messagesEndRef}>
          {/* Display the list of messages */}
          {messages.length > 0 ? (
            <div className="container">
              {messages.map((message, index) => {
                const isUserMessage = message.sender_id === senderId;

                const utcDate = new Date(message.timestamp + 'Z'); 
                const formattedTimestamp = utcDate.toLocaleString(undefined, {
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use the user's local timezone
                  // year: 'numeric',
                  // month: 'short',
                  // day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={index}
                    className={isUserMessage ? "userMessage" : "receiverMessage"}
                  >
                    <strong>{isUserMessage ? "You" : receiverUsername}:</strong> {message.content}
                    <br />
                    <small className="smallText">{formattedTimestamp}</small>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No messages yet.</p>
          )}
        </div>
      
        <div className="messageInputContainer">
          <textarea 
            id="messageContent" 
            placeholder="Type your message here..."
            value={messageContent}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
          ></textarea>
          <button 
            className="sendButton" 
            onClick={handleSendMessage} 
            disabled={!messageContent.trim()}
          >
            <img 
              src={sendIcon} 
              alt="Send" 
              style={{ width: '20px', height: '20px' }} 
            />
          </button> 
        </div>
        
      </div>
    </div>
  );
};

export default MessagingPage;
