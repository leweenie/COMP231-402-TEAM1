import React, { useState, useEffect } from "react";
import { Link } from 'react-router'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ReviewSubmission from "./ReviewSubmission";
import { saveReview, getReviewsForJob } from "../utils/reviewUtils";

const JobDetails = ({ jobId, onClose, show }) => {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 2;

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId || !show) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }
        const data = await response.json();
        setJobDetails(data);
                const jobReviews = getReviewsForJob(jobId);
                setReviews(jobReviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, show]);

    const handleReviewSubmit = async (review) => {
        const result = await saveReview(review);
        if (result.success) {
            setReviews(prevReviews => [...prevReviews, review]);
            setShowReviewForm(false);
        }
    };

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    if (error) return <div>Error: {error}</div>;
    if (!jobDetails) return null;

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{jobDetails.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {jobDetails.image && (
          <div
            style={{
              width: "100%",
              height: "300px",
              marginBottom: "1rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={jobDetails.image}
              alt={jobDetails.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        )}

        <div className="mb-3">
          <p>
            <strong>Location:</strong> {jobDetails.location}
          </p>
          <p>
            <strong>Posted:</strong>{" "}
            {new Date(jobDetails.postDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {jobDetails.status}
          </p>
        </div>

        <div className="mb-3">
          <h5>Description</h5>
          <p>{jobDetails.description}</p>
        </div>

        {jobDetails.skills && jobDetails.skills.length > 0 && (
          <div className="mb-3">
            <h5>Required Powers</h5>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {jobDetails.skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    background: "#f8f9fa",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                  }}
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
                <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Reviews</h5>
                        <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => setShowReviewForm(!showReviewForm)}
                        >
                            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                        </Button>
                    </div>

                    {showReviewForm && (
                        <ReviewSubmission
                            jobId={jobId}
                            jobTitle={jobDetails.title}
                            onSubmit={handleReviewSubmit}
                        />
                    )}

                    {reviews.length > 0 ? (
                        <>
                            <div className="reviews-list">
                                {currentReviews.map((review, index) => (
                                    <div key={index} className="review-item p-3 mb-2 border rounded" style={{
                                        boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)'
                                    }}>
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="star-rating me-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <span
                                                        key={i}
                                                        style={{
                                                            color: i < review.rating ? '#f1c40f' : '#ddd',
                                                            marginRight: '2px'
                                                        }}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <small className="text-muted">
                                                {new Date(review.timestamp).toLocaleDateString()}
                                            </small>
                                        </div>
                                        <p className="mb-0">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        size="sm"
                                        style={{
                                            borderRadius: '20px',
                                            padding: '4px 12px',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        ←
                                    </Button>
                                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                                        {currentPage} / {totalPages}
                                    </span>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        size="sm"
                                        style={{
                                            borderRadius: '20px',
                                            padding: '4px 12px',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        →
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-muted">No reviews yet. Be the first to review this job!</p>
                    )}
                </div>
      </Modal.Body>
      <Modal.Footer className='d-flex align-items-center justify-content-between'>
        <Link to={`/user/${jobDetails.creator}`}>
            <Button className="p-2" size="sm" variant="secondary">
              View Job Poster Profile
            </Button>
        </Link>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JobDetails;
