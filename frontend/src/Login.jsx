import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './Login.css';

const Login = () => {
    // State for the user variables
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();  

    
    // Function to log the user into the app
    const logInUser = async (e) => {
        e.preventDefault();  // Prevents the default form submission
    
        const data = { username, password };
    
        // Fetch the user by username from the backend
        let url = `http://127.0.0.1:5000/user/${username}`;
        let options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
    
        try {
            console.log("Sending GET request to:", url);
            const response = await fetch(url, options);
            
            // Check if the response is ok (status code is 200-299)
            if (response.ok) {
                console.log("User found, checking password...");
                const userData = await response.json();
                
                if (userData.password === password) {
                    // alert("Login successful! Redirecting to users page...");
                    navigate(`/users`, { state: { username: userData.username } });
                } else {
                    alert("Incorrect password. If this is a new account, the username you chose is already taken.");
                }
            } else if (response.status === 404) {
                console.log("User not found. Attempting to create a new user...");
    
                // User not found, so we create a new user
                url = "http://127.0.0.1:5000/create_user";
                options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                };
    
                const createResponse = await fetch(url, options);
                if (createResponse.ok) {
                    alert("Account created successfully!");
                    navigate(`/users`, { state: { username } });
                } else {
                    const errorData = await createResponse.json();
                    alert(errorData.message);
                }
            } else {
                console.log("Unexpected response status:", response.status);
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            // Catch any errors that are thrown by the fetch or during response processing
            console.error("An error occurred during the request:", error);
            alert(`An unexpected error occurred: ${error.message}`);
        }
    };
  
    return (
        <div className="loginContainer">
            <h1>Login</h1>
            
            <form onSubmit={logInUser}>
                <div className="inputDiv">
                    <label className="usernamePasswordLabel" htmlFor="username">Username</label>
                    <input 
                        type="text"
                        id="username"
                        className="textField"
                        placeholder="Enter username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>

                <div className="inputDiv">
                    <label className="usernamePasswordLabel" htmlFor="password">Password</label>
                    <input 
                        type="password"
                        id="password"
                        className="textField"
                        placeholder="Enter password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                <button type="submit" className="loginButton">Login</button>
                <p>If an account does not exist with your credentials, it will be created.</p>
            </form>
        </div>
  );
};

export default Login;