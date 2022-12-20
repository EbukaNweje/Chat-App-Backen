const User = require("../models/user.js");

exports.createUser = async (req, res, next) => {
  try {
    const savedUser = await User.create(req.body);
    res.status(201).json({
      message: "Created successfully",
      data: {
        savedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.getUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({
      status: "success",
      numberOfUsers: user.length,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error,
    });
  }
};
