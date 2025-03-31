import React, { useState } from "react";
import "./ReviewSubmission.css";

const ReviewSubmission = ({ jobId, jobTitle, onSubmit }) => {
  const [review, setReview] = useState({
    task: jobId,
    rating: 0,
    comment: "",
    dateReviewed: new Date().toISOString()
  });

  const handleRatingChange = (value) => {
    setReview((prev) => ({ ...prev, rating: value }));
  };

  const handleCommentChange = (e) => {
    setReview((prev) => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(review);
    setReview({
      task: jobId,
      rating: 0,
      comment: "",
      dateReviewed: new Date().toISOString()
    });
  };

  return (
    <div className="review-submission-container">
      <h2>Submit Review for {jobTitle}</h2>
      <form onSubmit={handleSubmit} className="review-form">
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
            placeholder="Share your experience..."
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
