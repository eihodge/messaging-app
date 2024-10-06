import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'
import Login from './Login.jsx';
import UserListPage from './UserListPage.jsx';
import MessagingPage from './MessagingPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="/message/:receiverId" element={<MessagingPage />} />
      </Routes>
    </Router>
  )
}

export default App




















// function App() {
//   const [users, setUsers] = useState([]);

//   // Modal (pop-up) window
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Store the user as its being edited
//   const [currentUser, setCurrentUser] = useState({})

//   useEffect(() => {
//     fetchUsers();
//   }, []); // Call only when it mounts

//   // async because it waits a second to fetch the content
//   const fetchUsers = async () => {
//     // Send API request to backend
//     const response = await fetch("http://127.0.0.1:5000/users");
//     const data = await response.json();  // {"users": []}
//     setUsers(data.users);
//   }

//   // Closes the modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//   }

//   // Open the modal to create or edit new user
//   const openModal = () => {
//     setIsModalOpen(true);
//   }

//   const openEditModal = (user) => {
//     // Check if the modal is open
//     if (isModalOpen) {
//       return
//     }
//     setCurrentUser(user)
//     setIsModalOpen(true)
//   }

//   const onUpdate = () => {
//     closeModal()
//     fetchUsers()
//   }
  
//   return (
//     <>
//       <UserList users={users} updateUser={openEditModal} updateCallback={onUpdate} />
//       <button onClick={openModal}>Create New User</button>
//       {
//         isModalOpen && 
//         <div className="modal">
//           <div className="modal-content">
//             <span className="close" onClick={closeModal}>&times;</span>
//             <UserForm existingUser={currentUser} updateCallback={onUpdate} />
//           </div>
//         </div>
//       }
//     </>
//   )
// }

// export default App