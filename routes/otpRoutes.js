const express = require("express");
const router = new express.Router();

const { userGuard } = require("../auth/auth");

const {
  sendOtp,
  verifyOtp,
  resendOtp,
} = require("../controller/otpController");

// Customer Register
router.route("/send").post(userGuard, sendOtp);
router.route("/verify").post(userGuard, verifyOtp);
router.route("/resend").post(userGuard, resendOtp);

module.exports = router;
