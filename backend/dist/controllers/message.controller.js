"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.sendMessage = void 0;
const conversation_model_js_1 = __importDefault(require("../models/conversation.model.js"));
const message_model_js_1 = __importDefault(require("../models/message.model.js"));
const socket_js_1 = require("../socket/socket.js");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        let conversation = yield conversation_model_js_1.default.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
            conversation = yield conversation_model_js_1.default.create({
                participants: [senderId, receiverId],
            });
        }
        const newMessage = new message_model_js_1.default({
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
        yield Promise.all([conversation.save(), newMessage.save()]);
        // SOCKET IO FUNCTIONALITY WILL GO HERE
        const receiverSocketId = (0, socket_js_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            // io.to(<socket_id>).emit() used to send events to specific client
            socket_js_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("Error in sendMessage controller: ", error.message);
        }
        else {
            console.log("An unknown error occurred", error);
        }
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id: userToChatId } = req.params;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const conversation = yield conversation_model_js_1.default.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES
        if (!conversation) {
            res.status(200).json([]);
            return;
        }
        const messages = conversation.messages;
        res.status(200).json(messages);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("Error in getMessages controller: ", error.message);
        }
        else {
            console.log("An unknown error occurred", error);
        }
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getMessages = getMessages;
