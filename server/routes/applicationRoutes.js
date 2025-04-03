const express = require("express");
const router = express.Router();
const { submitApplication, getApplicants, acceptApplicant } = require("../controllers/applicationController"); 

router.post("/apply", submitApplication);

router.get("/:taskID", getApplicants);

router.patch("/accept/:taskId/:applicantId", acceptApplicant);

module.exports = router;
