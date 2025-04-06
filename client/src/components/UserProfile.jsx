import React, { useEffect, useState } from 'react';
import { Link } from 'react-router'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image, { propTypes } from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/esm/Stack';
import Button from 'react-bootstrap/Button';
import { heroReviews, posterReviews} from './../utils/temp-reviews'

const UserProfile = (props) => {
    const {userId, viewerRole} = props;

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [userReviews, setUserReviews] = useState()

    const updateProfile = () => {
        console.log("Update Profile Clicked!");
    };

    useEffect(() => {
        if (userId) {
           const url = `http://localhost:5000/api/users/${userId}`
           fetch(url)
           .then(res=>res.json()).then(data => setUser(data))
        }
     }, [userId])

    useEffect(() => {
        if (userId) {
            const reviews = userId == '67e056755de81c089382446e' ? heroReviews : posterReviews
            for (const review of reviews) {
                const url = `http://localhost:5000/api/users/${review.reviewer._id}`
                fetch(url)
                .then(res=>res.json()).then(data => review.reviewer = data)
            }
            console.log(reviews)
            setUserReviews(reviews)
         }
    }, [userId])

    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>Loading user data...</p>;

    return (
        <Container className='p-2'>
            <Row className='p-2'>
            <Col xs={12} sm={3}>
                  <Stack className='dash-profile-panel p-4' direction='vertical' gap={3}>
                     <Image className='profile-picture' src={user.profile.image} roundedCircle />
                     <div className='user-bio-box'>
                        <h2>{user.name}</h2>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Bio:</strong> {user.profile?.bio || "No bio available"}</p>
                        {viewerRole === "Superhero" && (
                            <p><strong>Powers:</strong> { user.profile?.powers?.join(", ") || "No powers listed"}</p>
                        )}
                     </div>
                     {/* <div className='rating'>
                        <p>{user.profile.bio}</p>
                        <StarRatings rating={user.profile.avgRating} count={user.profile.numReviews}/>
                     </div> */}
                     <Button className="p-2" size="md" variant="secondary" onClick={updateProfile}>Update Profile</Button>
                  </Stack>
               </Col>
               <Col sm={6}>
                <Stack className='profile-review-panel p-4' direction='vertical' gap={3}>
                     <h2>Reviews for {user.name}</h2>
                     { userReviews.map((r,i) => <ReviewBox key={i} review={r}/>)}
                  </Stack>
               </Col>
               <Col sm={3}>
                <Stack className='profile-fave-panel p-4' direction='vertical' gap={3}>
                     <h2>My Favourite Heroes</h2>
                  </Stack>
               </Col>
            </Row>
        </Container>
    );
};

const ReviewBox = (props) => {
    const {review} = props
    let date = review.dateReviewed.slice(0,10)
    console.log(review)
    return (
        <div className='review-container p-2'>
            <div className='review-text'>
                <h3>{review.comment}</h3>
                <div className='d-flex'>
                    <div>{date}</div>
                    <div><Link to={`../user/${review.reviewer._id}`}>{review.reviewer.name}</Link></div>
                </div>
            </div>
            <div className='review-image'>
                <Image className='profile-picture' src={review.reviewer.profile.image} roundedCircle />
            </div>
        </div>
    )
}

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

