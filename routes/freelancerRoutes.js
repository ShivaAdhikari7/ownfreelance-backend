const express = require("express");
const router = new express.Router();

const upload = require("../uploads/imageUpload");
const { userGuard } = require("../auth/auth");
const {
  addFreelancerInfo,
  getAllFreelancers,
  getFreelancer,
  deleteFreelancer,
  updateFreelancer,
  saveWork,
} = require("../controller/freelancerController");

// Customer Register
router.route("/").get(userGuard, getAllFreelancers);
router.route("/add").post(userGuard, upload.single("img"), addFreelancerInfo);
router.route("/:id").get(userGuard, getFreelancer);
router
  .route("/update/:id")
  .put(userGuard, upload.single("img"), updateFreelancer);
router.route("/delete/:id").delete(userGuard, deleteFreelancer);

module.exports = router;
