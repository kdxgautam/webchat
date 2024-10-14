import bcrypt from "bcryptjs";
import { Request,Response } from "express";
import User from "../models/user.model";
import generateTokenAndSetCookie from "../utils/generateToken";
import { IUser,IUserWithoutPassword } from "../models/user.model";

declare module '../models/user.model' {
	interface IUser {
	  confirmPassword:string; // Adding the 'age' property
	}
  }



export const signup = async (req:Request, res:Response): Promise<void> => {
	try {
		const { fullName, username, password, confirmPassword, gender }:IUser = req.body;

		if (password !== confirmPassword) {
			 res.status(400).json({ error: "Passwords don't match" });
			 return
		}

		const user:IUser | null= await User.findOne({ username });

		if (user) {
			res.status(400).json({ error: "Username already exists" });
			return
		}

		// HASH PASSWORD HERE
		const salt:string = await bcrypt.genSalt(10);
		const hashedPassword:string = await bcrypt.hash(password, salt);

		
		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		const newUser = new User({
			fullName,
			username,
			password: hashedPassword,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});

		if (newUser) {
			// Generate JWT token here
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				profilePic: newUser.profilePic,
			});
			return
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error:unknown) {
		if (error instanceof Error) {
			console.log("Error in signup controller", error.message);
		} else {
			console.log("An unknown error occurred", error);
		}
		res.status(500).json({ error: "Internal Server Error" });
	}
};




export const login = async (req:Request, res:Response):Promise<void> => {
	try {
		const { username, password }: { username: string; password: string } = req.body;
		const user:IUser | null  = await User.findOne({ username });
		
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			 res.status(400).json({ error: "Invalid username or password" });
			 return
			}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
		return
	} catch (error:unknown) {
		if (error instanceof Error) {
			console.log("Error in login controller", error.message);
		} else {
			console.log("An unknown error occurred", error);
		}
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = (req:Request, res:Response) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error:unknown) {
		if (error instanceof Error) {
			console.log("Error in logout controller", error.message);
		} else {
			console.log("An unknown error occurred", error);
		}
		res.status(500).json({ error: "Internal Server Error" });
	}
};
