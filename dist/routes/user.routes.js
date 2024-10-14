"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const user_controller_1 = require("../controllers/user.controller");
// Create the router
const router = express_1.default.Router();
// Define the route to fetch users for the sidebar, protected by the middleware
router.get("/", protectRoute_1.default, user_controller_1.getUsersForSidebar);
exports.default = router;
