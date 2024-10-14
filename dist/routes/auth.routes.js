"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
// Define the router
const router = express_1.default.Router();
// Use route handlers with correct typing
router.post("/signup", auth_controller_1.signup);
router.post("/login", auth_controller_1.login);
router.post("/logout", auth_controller_1.logout);
exports.default = router;
