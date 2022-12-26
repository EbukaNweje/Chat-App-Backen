const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const messageRoute = require("./routes/message.js");
const userRoute = require("./routes/user.js");

const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

// io.on('connection', (socket) => {
//   console.log('a user connected');
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

app.use(express.json());

dotenv.config({ path: "./utils/.env" });

const DB = process.env.DATABASE;

mongoose.set("strictQuery", false);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Db connect success!!"));

app.use("/api/messages", messageRoute);
// app.use("/api/users", userRoute);

// res.sendFile(__dirname + "/index.html");

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(process.env.PORT || 500, () => {
  console.log("🌎 connected");
});
