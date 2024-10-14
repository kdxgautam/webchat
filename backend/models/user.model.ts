import mongoose from "mongoose";
import { Document,Schema,model } from "mongoose";



export interface IUser extends Document {
	_id: string;
	fullName: string;
	username: string;
	password:string;
	gender: string;
	profilePic: string;
}
export type IUserWithoutPassword = Omit<IUser, "password">;




const userSchema = new Schema<IUser>(
	{
		fullName: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		gender: {
			type: String,
			required: true,
			enum: ["male", "female"],
		},
		profilePic: {
			type: String,
			default: "",
		},
		// createdAt, updatedAt => Member since <createdAt>
	},
	{ timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
