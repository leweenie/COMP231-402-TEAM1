const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    status: { 
        type: String, 
        enum: ["active", "inactive", "completed", "in-progress"], 
        default: "active" 
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, 
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, 
    postDate: { type: Date, default: Date.now } 
}, 
{ timestamps: true }
); 

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
