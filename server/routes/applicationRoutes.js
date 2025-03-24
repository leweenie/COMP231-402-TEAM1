const express = require("express");
const router = express.Router();
const { submitApplication, getApplicants } = require("../controllers/applicationController"); 

router.post("/apply", submitApplication);

router.get("/:taskID", getApplicants);

module.exports = router;
