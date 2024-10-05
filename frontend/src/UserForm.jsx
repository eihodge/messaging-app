import { useState } from "react"
const UserForm = ({ existingUser = {}, updateCallback }) => {
    // State for the user variables
    const [firstName, setFirstName] = useState(existingUser.firstName || "");
    const [lastName, setLastName] = useState(existingUser.lastName || "");
    const [email, setEmail] = useState(existingUser.email || "");

    // If you pass an object with at least on entry inside of it, then its being updated not created
    const updating = Object.entries(existingUser).length !== 0;

    const onSubmit = async (e) =>  {
        // Prevent page from refreshing automatically
        e.preventDefault()

        // Define the data
        const data = {
            firstName,
            lastName,
            email
        }

        // Define the URL for the API request
        let url = ""
        if (updating) {
            url = "http://127.0.0.1:5000/" + `update_user/${existingUser.id}`
        } else {
            url = "http://127.0.0.1:5000/create_user"
        }
        
        // Set request options
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

        // Send the request
        const response = await fetch(url, options)

        // Check if request was successful
        if (response.status === 201 || response.status === 200) {
            // Close the modal
            updateCallback()

        } else {
            // Not successful
            const data = await response.json()
            alert(data.message)
        }
    }



    return <form onSubmit={onSubmit}>
        <div>
            <label htmlFor="firstName">First Name:</label>
            <input 
                type="text" 
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)} 
            />
        </div>


        <div>
            <label htmlFor="lastName">Last Name:</label>
            <input 
                type="text" 
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)} 
            />
        </div>

        <div>
            <label htmlFor="email">Email:</label>
            <input 
                type="text" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
            />
        </div>

        <button type="submit">{updating ? "Save" : "Create"} User</button>
    </form>
}

export default UserForm