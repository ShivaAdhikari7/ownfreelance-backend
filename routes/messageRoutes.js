const router = require("express").Router();
const { addMessage, getMessage } = require("../controller/messageController");
//add

router.post("/add", addMessage);

//get

router.get("/get/:conversationId", getMessage);

module.exports = router;
