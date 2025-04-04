const Application = require("../models/Application");
const Task = require("../models/Task");

const submitApplication = async (req, res) => {
    try {
        const { task, applicant, status, date } = req.body;

        if (!task || !applicant || !status || !date) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newApplication = new Application({
            task,
            applicant,
            status,
            date
        });

        await newApplication.save();
        res.status(201).json({ message: "Application submitted successfully!", application: newApplication });
    } catch (err) {
        res.status(500).json({ error: "Failed to submit application." });
    }
};

const getApplicants = async (req, res) => {
    try {
        const applicants = await Application.find({ task: req.params.taskID }).populate("applicant", "name email phone");

        if(!applicants.length) {
            return res.status(404).json({ error: "No applicants have applied to this task yet."});
        }

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

module.exports = { submitApplication, getApplicants, getAllApplications, acceptApplicant };
