const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Create a new review
router.post('/', async (req, res) => {
    try {
        const { jobId, jobTitle, rating, comment, timestamp } = req.body;
        
        // Create new review
        const review = new Review({
            task: jobId,  // Map jobId to task field
            rating: rating,
            comment: comment,
            dateReviewed: new Date(timestamp),
            // Note: reviewer and reviewee will be added later when we implement user authentication
        });

        // Save the review
        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).json({ message: 'Error saving review', error: error.message });
    }
});

// Get reviews for a specific job
router.get('/job/:jobId', async (req, res) => {
    try {
        const reviews = await Review.find({ task: req.params.jobId });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
});

module.exports = router; 