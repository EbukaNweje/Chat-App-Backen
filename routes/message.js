const express = require("express");
const messageController = require("../controllers/message.js");

const router = express.Router();

router.route("/:id/:friendId").post(messageController.createMessage).get(messageController.getMessages);

module.exports = router;
