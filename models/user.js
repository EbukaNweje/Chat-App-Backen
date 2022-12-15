const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "A userName is required"],
    },
    email: {
      type: String,
      required: [true, "An email is required"],
    },
    password: {
      type: String,
      required: [true, "A password is required"],
    },
    receivedMessages: {
      type: [String],
    },
    sentMessages: {
      type: [String]},
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
