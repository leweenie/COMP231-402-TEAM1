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

const acceptApplicant = async (req, res) => {
    const { applicantId, taskId } = req.params;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found." });
        }

        if (task.claimedBy) {
            return res.status(400).json({ error: "An applicant has already been accepted for this task." });
        }

        task.claimedBy = applicantId;
        task.status = "in-progress";
        await task.save();

        await Application.findOneAndUpdate(
            { applicant: applicantId, task: taskId },
            { status: "accepted" }
        );
        res.status(200).json({ message: "Applicant successfully accepted.", task });
    } catch (err) {
        res.status(500).json({ error: "An unexpected error occurred. Unable to accept applicant." });
    }
};

module.exports = { submitApplication, getApplicants, acceptApplicant };
