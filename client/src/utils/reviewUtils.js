export const saveReview = async (review) => {
  try {
    const response = await fetch('http://localhost:5000/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review)
    });

    if (!response.ok) {
      throw new Error('Failed to save review');
    }

    const savedReview = await response.json();
    return {
      success: true,
      message: 'Review submitted successfully!',
      review: savedReview
    };
  } catch (error) {
    console.error('Error saving review:', error);
    return {
      success: false,
      message: 'Failed to submit review',
      error: error.message
    };
  }
};

export const getReviewsForJob = async (jobId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/reviews/job/${jobId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    const reviews = await response.json();
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}; 