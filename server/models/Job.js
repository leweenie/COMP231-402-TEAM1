const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    skills: [{ type: String }], // Array to store selected abilities
    image: { type: String }, // Path for uploaded image
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    progress: { type: Number, min: 0, max: 100, default: 0 }
});

const Job = mongoose.model("job", jobSchema);
module.exports = Job;