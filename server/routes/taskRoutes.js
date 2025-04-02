const express = require("express");
const router = express.Router();
const { getAllTasks, getAllTasksSorted, createTask, getTaskByID, updateTaskStatus, updateTask } = require("../controllers/taskController");
const multer = require("multer");


// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

router.post("/create", upload.single("image"), createTask);
router.get("/", getAllTasks);
router.get("/board", getAllTasksSorted);
router.get("/:id", getTaskByID);
router.patch("/:id/progress", updateTaskStatus);
router.patch("/edit-job/:taskId", updateTask);

module.exports = router;