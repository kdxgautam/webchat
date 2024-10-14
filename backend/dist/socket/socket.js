"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.io = exports.app = exports.getReceiverSocketId = void 0;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});
exports.io = io;
// Typing for userSocketMap: userId -> socketId
const userSocketMap = {};
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
exports.getReceiverSocketId = getReceiverSocketId;
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    // Get userId from the handshake query parameters
    const userId = socket.handshake.query.userId;
    // Ensure userId is valid before adding to map
    if (userId) {
        userSocketMap[userId] = socket.id;
    }
    // Notify all clients of the current online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    // Listen for disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        // Remove user from the map
        if (userId) {
            delete userSocketMap[userId];
        }
        // Notify all clients of the updated online users list
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});
