import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []); // Call only when it mounts

  // async because it waits a second to fetch the content
  const fetchContacts = async () => {
    // Send API request to backend
    const response = await fetch("http://127.0.0.1:5000/contacts");
    const data = await response.json();  // {"contacts": []}
    setContacts(data.contacts);

    console.log(data.contacts);
  }
  
  
  return (
    <>
      
    </>
  )
}

export default App
