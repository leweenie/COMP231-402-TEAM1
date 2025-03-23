const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    bio: {type: String},
    image: {type: String},
    powers: {type: [String]},
    avgRating: {type: Number},
    numReviews: {type: Number}
}, {_id:false}
)

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    role: {type: [String]},
    profile: profileSchema,
    tasks_posted: [{ type: mongoose.Schema.Types.ObjectId, ref: "task" }],
    tasks_completed: [{ type: mongoose.Schema.Types.ObjectId, ref: "task" }]
}, 
); 

const User = mongoose.model("user", userSchema);
module.exports = User;
