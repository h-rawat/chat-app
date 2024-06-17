import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: ["http://localhost:3000"],
  methods: ["GET", "POST"],
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// {userId: socketId}
const userSocketMap = {};

io.on("connection", (socket) => {
  // console.log("User connected.", socket.id);
  console.log("User connected.");

  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // io.emit is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on is used to listen user events. can be used on both client and server side
  socket.on("disconnect", () => {
    // console.log("User disconnected.", socket.id);
    console.log("User disconnected.");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
