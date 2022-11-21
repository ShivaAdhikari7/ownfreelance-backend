const express = require("express");
const router = new express.Router();

const { registerUser } = require("../controller/userController");

// Customer Register
router.post("/register", registerUser);

module.exports = router;
