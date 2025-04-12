const Application = require("../models/Application");
const Task = require("../models/Task");
const User = require("../models/User");

const applyToTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { applicantId } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Job not found" });
        }

        const existingApplication = await Application.findOne({ task: taskId, applicant: applicantId });
        if (existingApplication) {
            return res.status(400).json({ error: "You have already applied for this task" });
        }

        const newApplication = new Application({
            task: taskId,
            applicant: applicantId
        });

        await newApplication.save();

        res.status(201).json({
            message: "Applied to job successfully", application: newApplication
        })
    } catch (err) {
        console.error("Error applying to task:", err);
        res.status(500).json({ error: "Failed to apply to task" });
    }
}

const getApplicants = async (req, res) => {
    try {
        const applicants = await Application.find({ task: req.params.taskID }).populate("applicant", "name email phone");
        res.json(applicants);
    } catch (err) {
        res.status(500).json({error: "An unexpected problem occured. Unable to get applicants." })
    }
};

const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find().populate("applicant", "name _id");
        res.json(applications);
    } catch (err) {
        console.error("Error getting all applications:", err);
        res.status(500).json({ error: "Failed to get applications" });
    }
};

const getApplicationsByUserId = async (req, res) => {
    try {
        const applicantId  = req.query.applicantId;
    
        if (!applicantId) {
            return res.status(400).json({ error: "Applicant ID is required" });
        }
    
        const applications = await Application.find({ applicant: applicantId })
        .populate("task", "title description creator")
        .populate("applicant", "name email phone");
    
        if (applications.length === 0) {
            return res.status(404).json({ message: "No applications found for this user" });
        }
    
        res.json(applications);
    } catch (error) {
        console.error("Error fetching applications by applicantId:", error);
        res.status(500).json({ error: "Failed to get applications" });
    }
}

const acceptApplicant = async (req, res) => {
    try {
        const { taskId, applicantId } = req.params;
        
        const acceptedApplication = await Application.findOneAndUpdate(
            { task: taskId, applicant: applicantId },
            { status: "accepted" },
            { new: true }
        );
        
        if (!acceptedApplication) {
            return res.status(404).json({ error: "Application not found" });
        }
        
        await Application.updateMany(
            { 
                task: taskId, 
                applicant: { $ne: applicantId },
                status: { $ne: "rejected" }
            },
            { status: "rejected" }
        );
        
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { 
                status: "in-progress",
                claimedBy: applicantId 
            },
            { new: true }
        );
        
        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        res.status(200).json({
            message: "Applicant accepted successfully",
            application: acceptedApplication,
            task: updatedTask
        });
    } catch (err) {
        console.error("Error accepting applicant:", err);
        res.status(500).json({ error: "Failed to accept applicant" });
    }
};

module.exports = { applyToTask, getApplicants, getAllApplications, getApplicationsByUserId, acceptApplicant };
