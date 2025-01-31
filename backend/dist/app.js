"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = exports.wsManager = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const conn_1 = __importDefault(require("@/config/conn"));
const rateLimit_1 = require("@/middlewares/rateLimit");
const errorHandler_1 = require("@/middlewares/errorHandler");
const logger_1 = require("@/middlewares/logger");
const http_1 = __importDefault(require("http"));
const swipeRoutes_1 = __importDefault(require("@/routes/swipeRoutes"));
const matchRoutes_1 = __importDefault(require("@/routes/matchRoutes"));
const messageRoutes_1 = __importDefault(require("@/routes/messageRoutes"));
const authRoutes_1 = __importDefault(require("@/routes/authRoutes"));
const userRoutes_1 = __importDefault(require("@/routes/userRoutes"));
const WebSocketManager_1 = require("./websocket/WebSocketManager");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(logger_1.logger);
(0, conn_1.default)();
app.use((0, rateLimit_1.rateLimit)(100, 60 * 1000));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/swipes', swipeRoutes_1.default);
app.use('/api/matches', matchRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use((req, res) => {
    res.status(404).json({ message: "Route non trouvée." });
});
app.use((err, req, res, next) => {
    (0, errorHandler_1.errorHandler)(err, req, res, next);
});
const PORT = process.env.PORT || 8001;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
exports.wsManager = new WebSocketManager_1.WebSocketManager();
//# sourceMappingURL=app.js.map