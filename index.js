const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { ExpressPeerServer } = require("peer");
const cors = require('cors');

app.use(express.static(__dirname + "/public"));

const peerServer = ExpressPeerServer(http, {
  debug: true,
});

app.use(cors({
  origin: '*'
}));

app.use("/peerjs", peerServer);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("streamUrl", (url) => {
    console.log("streamUrl", url);
    io.emit("streamUrl", url);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(3001, () => {
  console.log("listening on *:3001");
});
