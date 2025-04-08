const Task = require("../models/Task.js");
const Application = require("../models/Application.js");
const User = require("../models/User.js");
const axios = require("axios");

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

// @desc    Get all jobs, sorted by status = active and date, filtered by title, description, location, and/or powers
// @route   GET /api/tasks/board
const getAllTasksSorted = async (req, res) => {
    try {
        // variables to hold URL params representing the filters
        const { search, location, skills } = req.query;
        
        // Query for active jobs only
        let query = { status: "active" };

        // Filter by title or description, case insensitive
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" }}
            ];
        }

        // Filter by location, case insensitive
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        // Filter by skills
        if (skills) {
            const skillsArray = skills.split(",").map(decodeURIComponent);
            query.skills = { $in: skillsArray };
        }

        // Fetch jobs, filter by above queries, and sort by postDate newest first
        const tasks = await Task.find(query).sort({ postDate: -1 });
        
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
      const { title, location, description, skills, creator } = req.body;
      const imageFile = req.file;

      let imgurUrl = null;

      if (imageFile) {
        const imageBase64 = imageFile.buffer.toString("base64");

        const response = await axios.post(
            "https://api.imgur.com/3/image",
                { image: imageBase64 },
                {
                    headers: {
                        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                    },
                }
        );

        imgurUrl = response.data.data.link;
      }

      const newTask = new Task({
        title,
        location,
        description,
        skills: skills ? skills.split(",").map(s => s.trim()) : [],
        image: imgurUrl,
        status: "active",
        postDate: new Date(),
        creator
      });
  
      await newTask.save();
  
      res.status(201).json(newTask);
    } catch (err) {
      console.error("Create task error:", err);
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
            { new: true, runValidators: true }  // Return updated task & apply schema validation
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found." });
        }

        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Failed to update task status." });
    }
};

const deleteTask = async (req, res) => {
    try {
      const deleted = await Task.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
      console.error("Delete task error:", err);
      res.status(500).json({ error: "Failed to delete task" });
    }
  };
  
const editTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, image, skills } = req.body;

    const update = { title, description, image, skills }
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task could not be found."})
        } 
        res.status(200).json(updatedTask)
    } catch (err) {
        res.status(400).json({ error: "Task could not be updated."})
    }
};

module.exports = { getAllTasks, getAllTasksSorted, createTask, getTaskByID, updateTaskStatus, editTask, deleteTask };