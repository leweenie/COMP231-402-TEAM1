const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    reviewer: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    task: {type: mongoose.Schema.Types.ObjectId, ref: "task"},
    reviewee: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    rating: {type: Number},
    comment: {type: String},
    dateReviewed: {type: Date}
});

const Review = mongoose.model("review", reviewSchema);
module.exports = Review;