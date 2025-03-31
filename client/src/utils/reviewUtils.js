import reviewsData from '../data/reviews.json';

export const saveReview = (review) => {

  console.log('Saving review:', review);

  return {
    success: true,
    message: 'Review submitted successfully!'
  };
};

export const getReviewsForJob = (jobId) => {
  return reviewsData.reviews.filter(review => review.jobId === jobId);
}; 