import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import sendIcon from './sendIcon.png';
import './UserListPage.css'; 

const UserListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;

  // State for the users list
  const [users, setUsers] = useState([]);

  // Fetch users from the backend
  useEffect(() => {
    if (!username) {
      navigate("/", { replace: true }); // Redirect to login if username is not found
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/users");
        if (response.ok) {
          const data = await response.json();
          
          // Remove the logged in user from the list
          const usersFiltered = data.users.filter(user => user.username !== username);

          setUsers(usersFiltered); // Assuming the response structure is { "users": [...] }
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("An error occurred while fetching users:", error);
      }
    };

    fetchUsers();
  }, [username, navigate]);

  const sendMessage = (receiverUsername) => {
    navigate(
      `/message/${receiverUsername}`, 
      { state: { username: username, receiverUsername: receiverUsername } }
    );
  }


  // Redirect to login screen if the user is not logged in yet
  useEffect(() => {
    if (!username) {
      navigate("/", { replace: true }); 
    }
  }, [username, navigate]);

  // If username is not yet validated, return null to avoid rendering
  if (!username) {
    return null; // Prevents the component from rendering until username is validated
  }

  return (
    <div>
      <h1>Welcome, {username}</h1>
      <h2>User List</h2>
      {/* This displays the list of users and the "Send Message" button for each user */}

      <div className="user-table-container">
        <table className="user-table">
          <tbody className="user-table-body">
            {users.map((user) => (
              <tr key={user.id} className="user-row">
                <td className="user-username">{user.username}</td>
                <td className="user-action">
                  <button className="send-button" onClick={() => sendMessage(user.username)}>
                    <img 
                      className="send-icon"
                      src={sendIcon} 
                      alt="Send" 
                      style={{ width: '20px', height: '20px' }} 
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default UserListPage;

