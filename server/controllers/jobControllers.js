const Job = require("../models/Job");

// Create a new job
const createJob = async (req, res) => {
    try {
        const { title, location, description, skills } = req.body;
        const image = req.file ? req.file.path : null;

        const newJob = new Job({
            title,
            location,
            description,
            skills: skills ? skills.split(",") : [],
            image,
        });

        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({ error: "Unable to create job." });
    }
};

// Get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ error: "Could not retrieve jobs." });
    }
};

// Get job by ID
const getJobByID = async (req, res) => {
    const { id } = req.params;

    try {
        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({ error: "Job not found." });
        }
        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong, job could not be found." });
    }
};

// Get Active jobs
const getActiveJobs = async (req, res) => {
    try {
        const activeJobs = await Job.find({ status: "active" });
        res.status(200).json(activeJobs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch active jobs." });
    }
};

// Update Job Progress
const updateJobProgress = async (req, res) => {
    const { id } = req.params;
    const { progress } = req.body;

    try {
        if (progress < 0 || progress > 100) {
            return res.status(400).json({ error: "Progress must be between 0 and 100." });
        }

        const updatedJob = await Job.findByIdAndUpdate(id, { progress }, { new: true });

        if (!updatedJob) {
            return res.status(404).json({ error: "Job not found." });
        }

        res.status(200).json(updatedJob);
    } catch (err) {
        res.status(500).json({ error: "Failed to update job progress." });
    }
};

module.exports = { createJob, getAllJobs, getJobByID, getActiveJobs, updateJobProgress };
