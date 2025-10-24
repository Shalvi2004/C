const express = require('express');
const http = require('http');
const app = express();
const cors = require("cors");
const{Server} = require("socket.io");

app.use(
    cors({
        origin:"http://localhost:5173",
        methods:['Get','POST'],

    })
)
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send message", (data) => {
    // FIX: Use io.emit() to send the message to ALL connected clients (including the sender)
    socket.broadcast.emit("receive message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("✅ Server is running on port 3000");
});
