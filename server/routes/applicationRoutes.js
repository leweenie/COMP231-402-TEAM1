const express = require("express");
const router = express.Router();
const { submitApplication, getApplicants, acceptApplicant } = require("../controllers/applicationController"); 

router.post("/apply", submitApplication);

router.get("/:taskID", getApplicants);

router.patch("/accept/:applicantId/:jobId", acceptApplicant);

module.exports = router;
