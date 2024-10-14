import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { Request,Response } from "express";
import {IUserWithoutPassword } from "../models/user.model";


export const sendMessage = async (req:Request, res:Response):Promise<void> => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = (req.user as IUserWithoutPassword)?._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// await conversation.save();
		// await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error:unknown) {
		if(error instanceof Error){
			console.log("Error in sendMessage controller: ", error.message);
		}else{
			console.log("An unknown error occurred", error);
		}
		
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req:Request, res:Response):Promise<void> => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = (req.user as IUserWithoutPassword)?._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation)  {
			res.status(200).json([]);
			return
}
		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error:unknown) {
		if (error instanceof Error) {
			console.log("Error in getMessages controller: ", error.message);
		} else {
			console.log("An unknown error occurred", error);
		}
		
		res.status(500).json({ error: "Internal server error" });
	}
};
