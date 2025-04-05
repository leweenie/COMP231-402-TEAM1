const express = require("express");
const router = express.Router();
const { submitApplication, getApplicants, getAllApplications, acceptApplicant } = require("../controllers/applicationController"); 

router.post("/apply", submitApplication);

router.get("/all", getAllApplications);

router.get("/:taskID", getApplicants);

router.patch("/accept/:taskId/:applicantId", acceptApplicant);

module.exports = router;
