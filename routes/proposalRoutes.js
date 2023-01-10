const express = require("express");
const router = new express.Router();

const upload = require("../uploads/attachmentUploads");
const { userGuard } = require("../auth/auth");

const {
  addProposal,
  getAllNotifications,
  getApplicantDetail,
  updateProposal,
} = require("../controller/proposalController");

router.route("/add").post(userGuard, upload.single("attachment"), addProposal);
router.route("/all/notifications").get(userGuard, getAllNotifications);
router
  .route("/applicant/detail/:proposalId")
  .get(userGuard, getApplicantDetail);
router.route("/update/:proposalId").put(userGuard, updateProposal);

module.exports = router;
