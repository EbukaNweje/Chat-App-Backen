const Message = require("../models/message.js");
const User = require("../models/user.js");

exports.createMessage = async (req, res, next) => {
  const friend_Id = req.params.friendId;
  const user_Id = req.params.id;
  console.log(req.body);
  const { message } = req.body;
  try {
    const savedMessage = await Message.create({
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
    res.status(201).json({
      message: "Created successfully",
      data: {
        savedMessage,
      },
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

  let getAllOurMessages;
  friendMessage.sentMessages.map((friendSentmessage, i) => {
    userMessage.sentMessages.map((userSentMessage, index) => {
      if (
        userMessage.receivedMessages[i] === friendSentmessage &&
        userSentMessage === friendMessage.receivedMessages[index]
      ) {
        getAllOurMessages = getAllMessages.filter(
          (getOurMessage) =>
            getOurMessage._id !== userMessage.receivedMessages[i] &&
            getOurMessage._id !== friendMessage.receivedMessages[index]
        );
      }
    });
  });
  console.log("All our convo ",getAllOurMessages);
  try {
    res.status(200).json({
      message: "All messages found",
      data: {
        getAllOurMessages,
      },
    });
  } catch (err) {
    next(err);
  }
};
