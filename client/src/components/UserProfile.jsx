import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Card, Pagination } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const UserProfile = (props) => {
    const {userId} = props;
    const location = useLocation();
    const isOtherUserProfile = location.pathname.startsWith('/user/');
    const loggedInUserId = localStorage.getItem('userId');
    
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('taskId');

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 2;
    
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const updateProfile = () => {
        console.log("Update Profile Clicked!");
    };
    
    useEffect(() => {
        setCurrentPage(1);
    }, [reviews.length]);

    const submitReview = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            alert("Please select a rating before submitting.");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const reviewData = {
                reviewer: loggedInUserId,
                reviewee: userId,
                task: taskId,
                rating: rating,
                comment: reviewText,
                dateReviewed: new Date()
            };
            
            const response = await fetch('http://localhost:5000/api/reviews/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            setRating(0);
            setReviewText('');
            setShowReviewForm(false);
            
            alert("Thank you for your review!");
            
            fetchReviews();
                
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("There was an error submitting your review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
            const response = await fetch(`http://localhost:5000/api/reviews/user/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoadingReviews(false);
        }
    };

    useEffect(() => {
        console.log("useEffect is running...");
        fetch(`http://localhost:5000/api/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched user:", data); // Debugging line
                setUser(data);
                fetchReviews();
            })
            .catch(error => {
                console.error("Error fetching user:", error);
                setError(error.message);
            });
    }, [userId]);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} style={{ color: i <= rating ? '#FFD700' : '#ccc' }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>Loading user data...</p>;

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4">
                    <div style={styles.container}>
                        <img src={user.profile.image || "https://www.w3schools.com/w3images/avatar2.png"} alt="Profile" style={styles.image} />
                        <h2>{user.name}</h2>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Bio:</strong> {user.profile?.bio || "No bio available"}</p>
                        <p><strong>Powers:</strong> {user.profile?.powers?.join(", ") || "No powers listed"}</p>
                        
                        {!isOtherUserProfile && (
                            <button style={styles.button} onClick={updateProfile}>Update Profile</button>
                        )}
                        
                        {isOtherUserProfile && (
                            <button 
                                style={styles.button} 
                                onClick={() => setShowReviewForm(!showReviewForm)}
                            >
                                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="col-md-8">
                    {showReviewForm && (
                        <div style={styles.reviewContainer}>
                            <h3>Write a Review</h3>
                            <Form onSubmit={submitReview}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={2}>Rating:</Form.Label>
                                    <Col sm={10}>
                                        <div style={styles.starRating}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span 
                                                    key={star}
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontSize: '30px',
                                                        color: star <= rating ? '#FFD700' : '#ccc',
                                                        margin: '0 5px'
                                                    }}
                                                    onClick={() => setRating(star)}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={2}>Comments:</Form.Label>
                                    <Col sm={10}>
                                        <Form.Control 
                                            as="textarea" 
                                            rows={3} 
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            placeholder="Share your experience working with this person..."
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Col sm={{ span: 10, offset: 2 }}>
                                        <Button 
                                            type="submit" 
                                            variant="primary" 
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                        </Button>
                                    </Col>
                                </Form.Group>
                            </Form>
                        </div>
                    )}

                    <div style={styles.reviewsListContainer}>
                        <h3>Reviews</h3>
                        {loadingReviews ? (
                            <p>Loading reviews...</p>
                        ) : reviews.length > 0 ? (
                            <>
                                {currentReviews.map((review, index) => (
                                    <Card key={index} className="mb-3">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <div style={styles.reviewStars}>
                                                        {renderStars(review.rating)}
                                                    </div>
                                                    <Card.Text className="mt-2">{review.comment}</Card.Text>
                                                </div>
                                                <div className="text-muted">
                                                    {new Date(review.dateReviewed).toLocaleDateString()}
                                                </div>
                                            </div>
                                            {review.reviewer && review.reviewer.name && (
                                                <div className="text-muted mt-2">
                                                    Review by: {review.reviewer.name}
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                ))}
                                
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-center mt-4">
                                        <Pagination>
                                            <Pagination.Prev 
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                            />
                                            
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <Pagination.Item 
                                                    key={i + 1} 
                                                    active={currentPage === i + 1}
                                                    onClick={() => paginate(i + 1)}
                                                >
                                                    {i + 1}
                                                </Pagination.Item>
                                            ))}
                                            
                                            <Pagination.Next 
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                            />
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>
                </div>
            </div>
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

