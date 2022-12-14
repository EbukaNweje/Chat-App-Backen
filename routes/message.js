const express = require("express");
const messageController = require("../controllers/message");

const router = express.Router();

router.route("/:id/:friendId").post(messageController.createMessage);

module.exports = router;
