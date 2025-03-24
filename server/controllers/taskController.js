const Task = require("../models/Task.js");
const Application = require("../models/Application.js");
const User = require("../models/User.js");

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
        
        const tasksWithApplicants = await Promise.all(tasks.map(async (task) => {
            const applications = await Application.find({ task: task._id })
                .populate('applicant', 'name profile');
            
            return {
                ...task.toObject(),
                applicants: applications.map(app => ({
                    _id: app.applicant._id,
                    name: app.applicant.name,
                    profile: app.applicant.profile,
                    status: app.status,
                    date: app.date
                }))
            };
        }));

        res.status(200).json(tasksWithApplicants);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Create a new task
const createTask = async (req, res) => {
    try {
        const { title, location, description, skills } = req.body;
        const image = req.file ? req.file.path : null;

        const newTask = new Task({
            title,
            location,
            description,
            skills: skills ? skills.split(",") : [],
            image,
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ error: "Unable to create task." });
    }
};

// Get task by ID
const getTaskByID = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ error: "Task not found." });
        }
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong, task could not be found." });
    }
};


// Update Task Status
const updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["active", "inactive", "completed", "in-progress"];

    try {
        // Validate status input
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value." });
        }

        // Update task status
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true } // Return updated task & apply schema validation
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found." });
        }

        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Failed to update task status." });
    }
};

module.exports = { getAllTasks, getAllTasksSorted, createTask, getTaskByID, updateTaskStatus };