import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
	},
});

// Typing for userSocketMap: userId -> socketId
const userSocketMap: Record<string, string> = {}; 

export const getReceiverSocketId = (receiverId: string): string | undefined => {
	return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
	console.log("A user connected:", socket.id);

	// Get userId from the handshake query parameters
	const userId = socket.handshake.query.userId as string | undefined;

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

export { app, io, server };
