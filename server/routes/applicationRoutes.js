const express = require("express");
const router = express.Router();
const { submitApplication } = require("../controllers/applicationController"); 

router.post("/apply", submitApplication);

module.exports = router;
