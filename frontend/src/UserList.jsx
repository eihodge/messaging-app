import React from "react"

// Take users as a prompt
const UserList = ({ users, updateUser, updateCallback }) => {
    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_user/${id}`, options);
            if (response.status === 200) {
                updateCallback()
            } else {
                console.error(`Failed to delete user with ID: ${id}`);
            }
        
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }

    return <div>
        <h2>Users</h2>
        <table>
            <thead>
                <tr>
                    <th>username</th>
                    <th>password</th>
                    <th>Actions</th>
                </tr>
            </thead>
            
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.password}</td>
                        <td>
                            <button onClick = {() => updateUser(user)}>Edit</button>
                            <button onClick = {() => onDelete(user.id)}>Delete</button>
                            <button>Send Message</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default UserList