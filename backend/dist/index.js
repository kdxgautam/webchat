"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const socket_js_1 = require("./socket/socket.js");
const connectToMongoDB_1 = __importDefault(require("./db/connectToMongoDB"));
dotenv_1.default.config();
// const __dirname = path.resolve();
// PORT should be assigned after calling dotenv.config() because we need to access the env variables. 
const PORT = process.env.PORT || 5000;
socket_js_1.app.use(express_1.default.json()); // to parse the incoming requests with JSON payloads (from req.body)
socket_js_1.app.use((0, cookie_parser_1.default)());
socket_js_1.app.use("/api/auth", auth_routes_1.default);
socket_js_1.app.use("/api/messages", message_routes_1.default);
socket_js_1.app.use("/api/users", user_routes_1.default);
// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });
socket_js_1.server.listen(PORT, () => {
    (0, connectToMongoDB_1.default)();
    console.log(`Server Running on port ${PORT}`);
});
