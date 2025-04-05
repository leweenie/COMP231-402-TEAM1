const User = require("../models/User.js")


const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body)
        await newUser.save();
        res.status(201).json(newUser);
    } catch(err) {
        res.status(400).json({ error: "Unable to create user."})
    }
};

const updateUser = async(req, res) => {
    const { id } = req.params;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }  
        );

        if(!updatedUser) {
            return res.status(404).json({error: "Could not find the user for this ID."});
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: "User cannot be updated."})
        console.error("Error updating:", err.message)
    }
};

const addFavourite = async(req, res) => {
    const { id, favouriteid } = req.params;

    try {
        const updatedUser = await User.findByIdAndUpdate (
            id,
            { $addToSet: {favourites: favouriteid}},
            { new: true, runValidators: true }
        );

        if(!updatedUser) {
            return res.status(404).json({error: "Could not find the user for this ID."});
        }
        res.status(200).json(updatedUser)
    } catch(err) {
        res.status(400).json({ error: "User cannot be updated with a new favourite. Please try again."})
        console.error("Error updating:", err.message)
    }
}

const getUserByID = async(req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if(!user) {
            return res.status(404).json({error: "Could not find the user for this ID."});
        }
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json({error: "Something went wrong, user could not be found."});
    }
}

module.exports = { createUser, updateUser, addFavourite, getUserByID };