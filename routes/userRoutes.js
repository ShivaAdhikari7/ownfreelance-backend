const express = require("express");
const router = new express.Router();

const { registerUser, loginUser } = require("../controller/userController");

// Customer Register
router.post("/register", registerUser);

// Customer Login
router.post("/login", loginUser);

module.exports = router;
