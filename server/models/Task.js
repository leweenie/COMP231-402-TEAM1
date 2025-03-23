const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: {type: String},
    location: { type: String },
    status: { 
        type: String, 
        enum: ["active", "inactive", "completed", "in-progress"], 
        default: "active" 
    },
    skills: [{ type: String }], // Array to store selected abilities,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    postDate: { type: Date, default: Date.now } 
}, 
{ timestamps: true }
); 

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
