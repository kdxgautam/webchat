import express, { Request, Response } from "express";
import { getMessages, sendMessage } from "../controllers/message.controller";
import protectRoute from "../middleware/protectRoute";

// Create a router
const router = express.Router();

// Define types for route parameters 
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;
