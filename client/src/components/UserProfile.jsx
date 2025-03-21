import React, { useEffect, useState } from 'react';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const updateProfile = () => {
        console.log("Update Profile Clicked!");
    };
    
    

    useEffect(() => {
        console.log("useEffect is running...");
        fetch("http://localhost:5000/api/users/67db2e5c15fde8b56d70ee7d")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched user:", data); // Debugging line
                setUser(data);
            })
            .catch(error => {
                console.error("Error fetching user:", error);
                setError(error.message);
            });
    }, []);

    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>Loading user data...</p>;

    return (
        <div style={styles.container}>
            <img src={user.profilePic || "https://www.w3schools.com/w3images/avatar2.png"} alt="Profile" style={styles.image} />
            <h2>{user.name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Bio:</strong> {user.profile?.bio || "No bio available"}</p>
            <p><strong>Powers:</strong> {user.profile?.powers?.join(", ") || "No powers listed"}</p>
            <button style={styles.button} onClick={updateProfile}>Update Profile</button>
        </div>
    );
};

const styles = {
    container: {
        color: '#333',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        textAlign: 'center',
        maxWidth: '90%',
        width: '350px',
        margin: '20px auto',
        background: '#fff'
    },
    image: {
        borderRadius: '50%',
        width: '120px',
        height: '120px',
        marginBottom: '10px'
    },
    button: {
        padding: '10px 15px',
        marginTop: '10px',
        border: 'none',
        background: '#007bff',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default UserProfile;

