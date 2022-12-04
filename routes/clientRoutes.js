const express = require("express");
const router = new express.Router();

const { userGuard } = require("../auth/auth");
const upload = require("../uploads/fileUploads");
const {
  addClientInfo,
  getAllClients,
} = require("../controller/clientController");

// Client Register
router.route("/add").post(userGuard, upload.single("file"), addClientInfo);
router.route("/").get(userGuard, getAllClients);

module.exports = router;
