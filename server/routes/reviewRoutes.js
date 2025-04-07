const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
    try {
        const { jobId, rating, comment, timestamp, reviewee } = req.body;
        
        const review = new Review({
            task: jobId,
            rating: rating,
            comment: comment,
            dateReviewed: new Date(timestamp),
            reviewee: reviewee
        });

        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).json({ message: 'Error saving review', error: error.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        const { task, rating, comment, dateReviewed, reviewee } = req.body;
        
        const review = new Review({
            task: task || null,
            rating: rating,
            comment: comment,
            dateReviewed: dateReviewed ? new Date(dateReviewed) : new Date(),

            reviewee: reviewee
        });

        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).json({ message: 'Error saving review', error: error.message });
    }
});

router.get('/job/:jobId', async (req, res) => {
    try {
        const reviews = await Review.find({ task: req.params.jobId });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        
        const reviews = await Review.find({ reviewee: req.params.userId })
            .sort({ dateReviewed: -1 });
            
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
});

module.exports = router; 