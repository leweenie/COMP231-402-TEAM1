const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    task: {type: mongoose.Schema.Types.ObjectId, ref: "task"},
    applicant: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    status: {enum: ["accepted", "rejected", "application pending"], default: "application pending" },
    date: {type: Date, default: Date.now}
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
