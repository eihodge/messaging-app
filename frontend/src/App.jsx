import { useState, useEffect } from 'react'
import './App.css'
import ContactList from './ContactList.jsx'
import ContactForm from './ContactForm.jsx'

function App() {
  const [contacts, setContacts] = useState([]);

  // Modal (pop-up) window
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Store the contact as its being edited
  const [currentContact, setCurrentContact] = useState({})

  useEffect(() => {
    fetchContacts();
  }, []); // Call only when it mounts

  // async because it waits a second to fetch the content
  const fetchContacts = async () => {
    // Send API request to backend
    const response = await fetch("http://127.0.0.1:5000/contacts");
    const data = await response.json();  // {"contacts": []}
    setContacts(data.contacts);
  }

  // Closes the modal
  const closeModal = () => {
    setIsModalOpen(false);
  }

  // Open the modal to create or edit new contact
  const openModal = () => {
    setIsModalOpen(true);
  }

  const openEditModal = (contact) => {
    // Check if the modal is open
    if (isModalOpen) {
      return
    }
    setCurrentContact(contact)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchContacts()
  }
  
  return (
    <>
      <ContactList contacts={contacts} updateContact={openEditModal} updateCallback={onUpdate} />
      <button onClick={openModal}>Create New Contact</button>
      {
        isModalOpen && 
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <ContactForm existingContact={currentContact} updateCallback={onUpdate} />
          </div>
        </div>
      }
    </>
  )
}

export default App