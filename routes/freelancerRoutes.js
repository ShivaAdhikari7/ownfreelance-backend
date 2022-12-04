const express = require("express");
const router = new express.Router();

const upload = require("../uploads/imageUpload");
const { userGuard } = require("../auth/auth");
const {
  addFreelancerInfo,
  getAllFreelancers,
} = require("../controller/freelancerController");

// Customer Register
router.route("/").get(userGuard, getAllFreelancers);
router.route("/add").post(userGuard, upload.single("img"), addFreelancerInfo);

module.exports = router;
