const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobControllers");
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

router.post("/", upload.single("image"), jobController.createJob);
router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getJobByID);


module.exports = router;