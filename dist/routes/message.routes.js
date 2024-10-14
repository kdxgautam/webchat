"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controllers/message.controller");
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
// Create a router
const router = express_1.default.Router();
// Define types for route parameters 
router.get("/:id", protectRoute_1.default, message_controller_1.getMessages);
router.post("/send/:id", protectRoute_1.default, message_controller_1.sendMessage);
exports.default = router;
