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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const protectRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.jwt;
        console.log("Token:", token);
        if (!token) {
            console.log("No token found in cookies");
            res.status(401).json({ error: "Unauthorized - No Token Provided" });
            return; // This ensures the function resolves to 'void'
        }
        const secret = "SECRET"; // Provide a default value or handle undefined
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            const user = yield user_model_1.default.findById(decoded.userId).select("-password"); // Exclude the password field
            if (!user) {
                console.log("User not found");
                res.status(404).json({ error: "User not found" });
                return; // Ensure you return here as well
            }
            req.user = user; // Attach the user to the request
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                // Handle specific JWT errors like invalid signature, expired token
                console.error("JWT verification failed:", error.message);
                res.status(401).json({ error: "Unauthorized - Invalid Token" });
                return; // Return after sending the response
            }
            else {
                console.error("Unexpected error during token verification:", error);
                res.status(500).json({ error: "Internal Server Error" });
                return; // Return after sending the response
            }
        }
    }
    catch (error) {
        console.error("Error in protectRoute middleware:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return; // Return here to resolve to void
    }
});
exports.default = protectRoute;
