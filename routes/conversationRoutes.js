const router = require("express").Router();

const {
  getAllConversation,
  getConversation,
  addConversation,
} = require("../controller/conversationController");
//new conv

router.post("/add", addConversation);

//get conv of a user

router.get("/:userId", getConversation);

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", getAllConversation);

module.exports = router;
