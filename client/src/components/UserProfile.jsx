import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Card, Pagination } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import UserReviews from './UserReviews';
import UserFavourites from './UserFavourites';

const UserProfile = (props) => {
    const {userId, currentId, isUserFave, setDisplayedUserId} = props;
    const location = useLocation();
    const navigate = useNavigate();
    const isOtherUserProfile = location.pathname.startsWith('/user/');
    const loggedInUserId = localStorage.getItem('userId');

    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('taskId');

    const [user, setUser] = useState(null); 
    const [error, setError] = useState(null); 
    const [showReviewForm, setShowReviewForm] = useState(false); 
    const [isFavourite, setIsFavourite] = useState(false)

    const updateProfile = () => {
        console.log("Update Profile Clicked!");
    };

    useEffect(() => { setIsFavourite(isUserFave) }, [isUserFave])

    useEffect(() => {
        if (!userId || userId === 'null') {
            navigate('/');
            return;
        }

        fetch(`http://localhost:5000/api/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setUser(data);
            })            
            .catch(error => {
                console.error("Error fetching user:", error);
                setError(error.message);
            });
    }, [userId, navigate]);

    const addFavourite = async () => {
         const response = await fetch(`http://localhost:5000/api/users/${currentId}/add/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);        
        } else setIsFavourite(true)

         
    }

    const navProfiles = (id) => {
        if (currentId) setDisplayedUserId(id)
        navigate(`/user/${id}`)
    }

    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>Loading user data...</p>;

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-3">
                    <div style={styles.container}>
                        <img src={user.profile.image || "https://www.w3schools.com/w3images/avatar2.png"} alt="Profile" style={styles.image} />
                        <h2>{user.name}</h2>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Bio:</strong> {user.profile?.bio || "No bio available"}</p>
                        <p><strong>Powers:</strong> {user.profile?.powers?.join(", ") || "No powers listed"}</p>
                        
                        {!isOtherUserProfile && (
                            <Button onClick={updateProfile}>Update Profile</Button>
                        )}
                        
                        {isOtherUserProfile && (
                            <div>
                                <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                                    { showReviewForm ? 'Cancel Review' : 'Write a Review' }
                                </Button>
                                {user.role == 'superhero' ? <FaveButton isFavourite={isFavourite} addFavourite={addFavourite} /> : null}
                            </div>
                        )}
                    </div>
                </div>
                <UserReviews showReviewForm={showReviewForm} setShowReviewForm={setShowReviewForm} loggedInUserId={loggedInUserId} userId={userId} taskId={taskId} />
                <UserFavourites userId={userId} navProfiles={navProfiles} />
            </div>
        </div>
    );
};

const FaveButton = (props) => {
    const { isFavourite, addFavourite } = props
    
    if (isFavourite) 
        return (
            <Button variant='outline-primary' className='fave-button' >Favourite <img src='/src/assets/heart-fill.svg'/></Button>
        )
    else 
        return (
            <Button variant='outline-primary' className='fave-button' onClick={() => addFavourite()}>Add Favourite <img src='/src/assets/heart.svg'/></Button>
        )
}

const styles = {
    container: {
        color: '#333',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        textAlign: 'center',
        width: '100%',
        margin: '0 0 20px 0',
        background: '#fff'
    },
    reviewContainer: {
        color: '#333',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        width: '100%',
        marginBottom: '20px',
        background: '#fff'
    },
    reviewsListContainer: {
        color: '#333',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        width: '100%',
        background: '#fff'
    },
    image: {
        borderRadius: '50%',
        width: '120px',
        height: '120px',
        marginBottom: '10px',
        objectFit: 'cover'
    },
    button: {
        padding: '10px 15px',
        marginTop: '10px',
        border: 'none',
        background: '#007bff',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    starRating: {
        display: 'flex',
        alignItems: 'center'
    },
    reviewStars: {
        fontSize: '24px'
    }
};



export default UserProfile;