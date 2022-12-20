const express = require("express");
const Message = require("../models/message.js");
const User = require("../models/user.js");

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
    friendMessage.receivedMessages.map((friendReceivedMessage) =>
        getAllMessages.map((getOurMessage) => {
          if (userSentMessage === friendReceivedMessage ) {
            if (
              getOurMessage._id.toString() === friendReceivedMessage ||
              getOurMessage._id.toString() === userSentMessage
              )
            return gottenMessage.push(getOurMessage);
          }
        }
    )
    )
  );
  //here, i try to remove duplicates... but I need to optimise this function cos of too much loops
  const UserFriendMessages = gottenMessage.filter((value, index, self) =>
  index === self.findIndex((t) => (
    t.message === value.message
  ))
)
console.log("My t ", UserFriendMessages)

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
