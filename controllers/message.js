const Message = require("../models/message");


exports.createMessage = async (req, res, next) => {
    const friend_Id = req.params.friendId
    const user_Id = req.params.id
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
    // const savedRoom = await newRoom.save();
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
