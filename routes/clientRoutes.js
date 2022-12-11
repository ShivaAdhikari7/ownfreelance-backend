const express = require("express");
const router = new express.Router();

const { userGuard } = require("../auth/auth");
const upload = require("../uploads/fileUploads");
const {
  addClientInfo,
  getAllClients,
  getClient,
  updateClient,
  deleteClient,
} = require("../controller/clientController");

// Client Register
router.route("/add").post(userGuard, upload.single("file"), addClientInfo);
router.route("/").get(userGuard, getAllClients);
router.route("/:id").get(userGuard, getClient);
router.route("/update/:id").put(userGuard, upload.single("img"), updateClient);
router.route("/delete/:id").delete(userGuard, deleteClient);

module.exports = router;
