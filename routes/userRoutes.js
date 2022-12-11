const express = require("express");
const router = new express.Router();
const { userGuard } = require("../auth/auth");

const {
  registerUser,
  loginUser,
  getUserInfo,
  updateUser,
  deleteUser,
  savePost,
  getAllSavedPosts,
} = require("../controller/userController");

// Customer Register
router.post("/register", registerUser);

// Customer Login
router.post("/login", loginUser);

router.route("/me").get(userGuard, getUserInfo);
router.route("/update").put(userGuard, updateUser);
router.route("/delete").delete(userGuard, deleteUser);
router.route("/save/:id").post(userGuard, savePost);
router.route("/save/posts").get(userGuard, getAllSavedPosts);

module.exports = router;
