import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import User from "../models/user.model";
import { IUserWithoutPassword } from "../models/user.model"; // Import the IUser interface

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
	interface Request {
		user?: IUserWithoutPassword;
	}
}

interface DecodedToken {
	userId: string;
}

const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const token: string | null = req.cookies.jwt;
		console.log("Token:", token);

		if (!token) {
			console.log("No token found in cookies");
			res.status(401).json({ error: "Unauthorized - No Token Provided" });
			return; // This ensures the function resolves to 'void'
		}

		const secret = "SECRET"; // Provide a default value or handle undefined
		
		try {
			const decoded = jwt.verify(token, secret) as DecodedToken; 

			const user = await User.findById(decoded.userId).select("-password"); // Exclude the password field

			if (!user) {
				console.log("User not found");
				res.status(404).json({ error: "User not found" });
				return; // Ensure you return here as well
			}

			req.user = user; // Attach the user to the request
			next();
		} catch (error: unknown) {
			if (error instanceof Error) {
				// Handle specific JWT errors like invalid signature, expired token
				console.error("JWT verification failed:", error.message);
				res.status(401).json({ error: "Unauthorized - Invalid Token" });
				return; // Return after sending the response
			} else {
				console.error("Unexpected error during token verification:", error);
				res.status(500).json({ error: "Internal Server Error" });
				return; // Return after sending the response
			}
		}
	} catch (error: unknown) {
		console.error("Error in protectRoute middleware:", error);
		res.status(500).json({ error: "Internal Server Error" });
		return; // Return here to resolve to void
	}
};

export default protectRoute;
