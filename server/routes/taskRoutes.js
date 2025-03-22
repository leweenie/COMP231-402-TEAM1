const express = require("express");
const router = express.Router();
const { getAllTasks, getAllTasksSorted } = require("../controllers/taskController");

router.get("/", getAllTasks);
router.get("/board", getAllTasksSorted);

module.exports = router;