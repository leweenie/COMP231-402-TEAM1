const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    task: {type: mongoose.Schema.Types.ObjectId, ref: "Task"},
    applicant: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    status: { type: String, enum: ["accepted", "rejected", "application pending"], default: "application pending" },
    date: {type: Date, default: Date.now}
});

const Application = mongoose.model("application", applicationSchema);
module.exports = Application;
