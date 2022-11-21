const express = require("express");
const router = new express.Router();

const upload = require("../uploads/imageUpload");
const { userGuard } = require("../auth/auth");
const { addFreelancerInfo } = require("../controller/freelancerController");

// Customer Register
router.route("/add").post(userGuard, upload.single("img"), addFreelancerInfo);

module.exports = router;
