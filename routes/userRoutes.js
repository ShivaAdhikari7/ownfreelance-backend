const express = require("express");
const router = new express.Router();
const { userGuard } = require("../auth/auth");

const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controller/userController");

// Customer Register
router.post("/register", registerUser);

// Customer Login
router.post("/login", loginUser);

router.route("/me").get(userGuard, getUserInfo);

module.exports = router;
