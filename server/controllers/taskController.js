const Task = require("../models/Task.js");

// @desc    Get all jobs
// @route   GET /api/tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get all jobs, sorted by status = active and date; for default Job Board
// @route   GET /api/tasks/board
const getAllTasksSorted = async (req, res) => {
    try {
        const tasks = await Task.find({ status: "active" }).sort({ postDate: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getAllTasks, getAllTasksSorted };