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

  let ourMessages = [];
  userMessage.receivedMessages.map((userReceivedmessage, index) => {
    friendMessage.sentMessages.map((friendSentmessage) => {
      userMessage.sentMessages.map((userSentMessage) => {
        friendMessage.receivedMessages.map((friendReceivedMessage) => {
          if (
            userReceivedmessage === friendSentmessage &&
            userSentMessage === friendReceivedMessage
          ) {
            let getAllOurMessages = getAllMessages.filter(
              (getOurMessage) =>
                getOurMessage._id !== userReceivedmessage &&
                getOurMessage._id !== friendReceivedMessage
            );
            console.log(getAllOurMessages);
            // ourMessages.push(userReceivedmessage, friendReceivedMessage);
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
          }
        });
      });
    });
  });
  console.log("our messages is ", ourMessages);
};
