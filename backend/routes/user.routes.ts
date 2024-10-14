import express, { Request, Response } from "express";
import protectRoute from "../middleware/protectRoute";
import { getUsersForSidebar } from "../controllers/user.controller";
import { get } from "http";

// Create the router
const router = express.Router();

// Define the route to fetch users for the sidebar, protected by the middleware
router.get("/", protectRoute, getUsersForSidebar);

export default router;
