const Application = require("../models/Application");

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

module.exports = { submitApplication, getApplicants };
