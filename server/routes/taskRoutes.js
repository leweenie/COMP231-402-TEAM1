const express = require("express");
const router = express.Router();
const { getAllTasks, getAllTasksSorted, getAllTasksByUserId, createTask, getTaskByID, updateTaskStatus, deleteTask, editTask } = require("../controllers/taskController");
const multer = require("multer");


// Multer configuration for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create", upload.single("image"), createTask);
router.get("/userjobs", getAllTasksByUserId)
router.get("/board", getAllTasksSorted);
router.get("/", getAllTasks);
router.get("/:id", getTaskByID);
router.patch("/:id/progress", updateTaskStatus);
router.patch("/:id", editTask);
router.patch("/complete/:id", updateTaskStatus);
router.delete("/:id", deleteTask);


module.exports = router;
