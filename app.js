const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

let userCount = 0; // Initialize user count

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  userCount++; // Increment user count on connection
  console.log(`User connected. Total users: ${userCount}`);

  socket.on("send-location", function (data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", function () {
    userCount--; // Decrement user count on disconnection
    console.log(`User disconnected. Total users: ${userCount}`);
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(3000);
