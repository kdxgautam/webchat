import express, { Request, Response } from "express";
import { login, logout, signup } from "../controllers/auth.controller";

// Define the router
const router = express.Router();

// Use route handlers with correct typing
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout",logout);

export default router;
