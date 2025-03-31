import React, { useState, useEffect } from 'react';
import "./ReviewSubmission.css";

const ReviewSubmission = ({ jobId, jobTitle, onSubmit }) => {
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
    jobId: jobId,
    jobTitle: jobTitle,
    timestamp: new Date().toISOString(),
  });
  const [applicants, setApplicants] = useState([]);
  const [selectedSuperhero, setSelectedSuperhero] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/applications/${jobId}`);
        const applications = await response.json();
        console.log('Applications:', applications);
        
        if (applications && applications.length > 0) {
          const applicantsWithDetails = await Promise.all(
            applications.map(async (application) => {
              console.log('Fetching user for application:', application);
              const userResponse = await fetch(`http://localhost:5000/api/users/${application.applicant._id}`);
              const userData = await userResponse.json();
              console.log('User data:', userData);
              return {
                userId: application.applicant._id,
                name: userData.name,
                profile: userData.profile,
                applicationStatus: application.status
              };
            })
          );
          
          console.log('Applicants with details:', applicantsWithDetails);
          setApplicants(applicantsWithDetails);
          if (applicantsWithDetails.length > 0) {
            setSelectedSuperhero(applicantsWithDetails[0].userId);
          }
        } else {
          setApplicants([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applicants:', error);
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleRatingChange = (value) => {
    setReview((prev) => ({ ...prev, rating: value }));
  };

  const handleCommentChange = (e) => {
    setReview((prev) => ({ ...prev, comment: e.target.value }));
  };

  const handleSuperheroChange = (e) => {
    setSelectedSuperhero(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...review,
      superheroId: selectedSuperhero
    });
    setReview({
      rating: 0,
      comment: "",
      jobId: jobId,
      jobTitle: jobTitle,
      timestamp: new Date().toISOString(),
    });
  };

  if (loading) {
    return <div className="review-submission-container">Loading applicants...</div>;
  }

  if (applicants.length === 0) {
    return <div className="review-submission-container">No applicants found for this job.</div>;
  }

  return (
    <div className="review-submission-container">
      <h2>Submit Review for {jobTitle}</h2>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="superhero-select-container">
          <label htmlFor="superhero">Select Superhero to Review:</label>
          <select
            id="superhero"
            value={selectedSuperhero}
            onChange={handleSuperheroChange}
            required
          >
            {applicants.map((applicant) => (
              <option key={applicant.userId} value={applicant.userId}>
                {applicant.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rating-container">
          <label>Rating:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= review.rating ? "filled" : ""}`}
                onClick={() => handleRatingChange(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="comment-container">
          <label htmlFor="comment">Your Review:</label>
          <textarea
            id="comment"
            value={review.comment}
            onChange={handleCommentChange}
            placeholder="Share your experience with this superhero..."
            required
            rows="4"
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewSubmission;
