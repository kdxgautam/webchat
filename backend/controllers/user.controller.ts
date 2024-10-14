import User from "../models/user.model.js";
import { Request, Response } from "express";
import { IUserWithoutPassword } from "../models/user.model.js";

export const getUsersForSidebar = async (req: Request, res: Response) => {
	try {
		const loggedInUserId = (req.user as IUserWithoutPassword)?._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error in getUsersForSidebar: ", error.message);
		}
		else {
			console.error("An unknown error occurred", error);
		}

		res.status(500).json({ error: "Internal server error" });
	}
};
