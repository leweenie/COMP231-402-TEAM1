const express = require("express");
const router = express.Router();
const { applyToTask, getApplicants, getAllApplications, getApplicationsByUserId, acceptApplicant } = require("../controllers/applicationController"); 

router.post("/apply/:taskId", applyToTask);

router.get("/all", getAllApplications);

router.get("/status", getApplicationsByUserId)

router.get("/:taskID", getApplicants);

router.patch("/accept/:taskId/:applicantId", acceptApplicant);

module.exports = router;
