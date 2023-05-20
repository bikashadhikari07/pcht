const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const server = http.createServer(app);

app.use(express.static(path.join(__dirname + "/public")));

const cors = require("cors");

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // ...
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (room, username) => {
    // const { username, room } = data;
    socket.join(room);
    console.log(`${username} has joined room ${room}`);
    socket.broadcast
      .to(room)
      .emit("chat_msg", `${username} has joined room ${room}`); // Broadcast the message to all clients in the room except the sender
  });

  // socket.on("send_message", (data) => {
  //   // console.log(data);
  //   socket.to(data.room).emit("receive_message", data);
  // });

  socket.on("chat_msg", (data) => {
    console.log(data);
    const room = data.room;
    console.log(`msg: ${data}, room: ${room}`);
    io.to(room).emit("chat_msg", data);
    // socket.to(data.room).emit(
    //   "message",
    //   data
    //   // room: data.room,
    // );
  });
});

const PORT = process.env.PORT || 3001;
// server.listen(3001, () => {
//   console.log("SERVER IS RUNNING");
// });

server.listen(PORT),
  () => {
    console.log("SERVER IS RUNNING");
  };
