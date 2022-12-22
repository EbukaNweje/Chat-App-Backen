const express = require("express");
const Message = require("../models/message.js");
const User = require("../models/user.js");
const errors = require("../utils/error.js");

const app = express();

// const http = require("http");
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

// //for post request this can be used
// io.on("connection", (socket) => {
//   socket.on("chat message", (msg) => {
//     console.log("message: " + msg);
//   });
// });

// //for get request, this can be used here
// io.on("connection", (socket) => {
//   socket.on("chat message", (msg) => {
//     io.emit("chat message", msg);
//   });
// });

exports.createMessage = async (req, res, next) => {
  const friend_Id = req.params.friendId;
  const user_Id = req.params.id;
  console.log(req.body);
  const { message } = req.body;
  try {
    const savedMessage = new Message({
      message,
      userId: user_Id,
    });
    try {
      await User.findByIdAndUpdate(friend_Id, {
        $push: { receivedMessages: savedMessage._id },
      });
      await User.findByIdAndUpdate(user_Id, {
        $push: { sentMessages: savedMessage._id },
      });
    } catch (error) {
      next(error);
    }
    savedMessage.save((err) => {
      if (err) sendStatus(500);
      // io.emit("message", req.body);
      res.status(201).json({
        message: "Created successfully",
        data: {
          savedMessage,
        },
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  const friend_Id = req.params.friendId;
  const user_Id = req.params.id;
  const getAllMessages = await Message.find();
  const userMessage = await User.findById(user_Id);
  const friendMessage = await User.findById(friend_Id);

  let gottenMessage = [];
  userMessage.sentMessages.map((userSentMessage) =>
    friendMessage.receivedMessages.map((friendReceivedMessage) => {
      if (
        userMessage.receivedMessages.length ||
        friendMessage.sentMessages.length
      ) {
        userMessage.receivedMessages.map((userReceivedMessage) =>
          friendMessage.sentMessages.map((friendSentMessage) =>
            getAllMessages.map((getOurMessage) => {
              if (
                userSentMessage === friendReceivedMessage &&
                friendSentMessage === userReceivedMessage
              ) {
                if (
                  getOurMessage._id.toString() === friendReceivedMessage ||
                  getOurMessage._id.toString() === userSentMessage ||
                  getOurMessage._id.toString() === userReceivedMessage ||
                  getOurMessage._id.toString() === friendSentMessage
                )
                  return gottenMessage.push(getOurMessage);
              }
            })
          )
        );
      } else
        getAllMessages.map((getOurMessage) => {
          if (userSentMessage === friendReceivedMessage) {
            if (
              getOurMessage._id.toString() === friendReceivedMessage ||
              getOurMessage._id.toString() === userSentMessage
            )
              return gottenMessage.push(getOurMessage);
          }
        });
    })
  );
  //here, i try to remove duplicates... but I need to optimise this function cos of too much loops
  const UserFriendMessages = gottenMessage.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.message === value.message)
  );

  try {
    res.status(200).json({
      message: "All messages found",
      data: {
        UserFriendMessages,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMessage = async (req, res, next) => {
  const friend_Id = req.params.friendId;
  const user_Id = req.params.id;
  const findMessage = await Message.findById(req.params.messageId);
  if (findMessage === null) return next(errors.createError(404, "Message not found"));
  try {
    try {
      await User.findByIdAndUpdate(user_Id, {
        $pull: { sentMessages: req.params.messageId },
      });
      await User.findByIdAndUpdate(friend_Id, {
        $pull: { receivedMessages: req.params.messageId },
      });
    } catch (error) {
      next(error);
    }
    await Message.findByIdAndDelete(req.params.messageId);
    res.status(200).json({
      message: "Successfully deleted Message!!",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMessage = async (req, res, next) => {
  const user_Id = req.params.id;
  const userMessage = await User.findById(user_Id);
  const getAllMessages = await Message.findById(req.params.messageId);

  if (!userMessage) return next(errors.createError(404, "User not found"))
  const messageIdToBeUpdated = userMessage.sentMessages.map((userSentMessage) => {
    if(getAllMessages._id.toString() === userSentMessage) {
      return userSentMessage
    }
  })
  try {
    const updatedRoom = await Message.findByIdAndUpdate(messageIdToBeUpdated[0], req.body, {
      new: true,
    });
    res.status(200).json({
      message: "Successfully updated",
      data: {
        updatedRoom,
      },
    });
  } catch (error) {
    next(error);
  }
};
