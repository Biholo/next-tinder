"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketManager = void 0;
const ws_1 = require("ws");
const app_1 = require("../app");
const jwt_1 = require("@/utils/jwt");
const messageModel_1 = __importDefault(require("@/models/messageModel"));
class WebSocketManager {
    constructor() {
        this.wss = new ws_1.WebSocketServer({ server: app_1.server });
        this.clients = new Map();
        this.initialize();
    }
    initialize() {
        this.wss.on('connection', async (ws, request) => {
            var _a;
            try {
                const token = (_a = request.url) === null || _a === void 0 ? void 0 : _a.split('token=')[1];
                if (!token) {
                    ws.close(1008, 'Token manquant');
                    return;
                }
                const decoded = await (0, jwt_1.verifyToken)(token);
                ws.userId = decoded.userId;
                ws.isAlive = true;
                this.clients.set(decoded.userId, ws);
                const connectEvent = {
                    event: 'connect',
                    message: 'Bienvenue sur la messagerie en temps réel'
                };
                this.sendToClient(ws, connectEvent);
                ws.on('message', (data) => this.handleMessage(ws, data));
                ws.on('close', () => this.handleDisconnect(ws));
                ws.on('pong', () => { ws.isAlive = true; });
            }
            catch (error) {
                ws.close(1008, 'Authentification échouée');
            }
        });
        setInterval(() => {
            this.wss.clients.forEach((ws) => {
                const authWs = ws;
                if (!authWs.isAlive)
                    return authWs.terminate();
                authWs.isAlive = false;
                authWs.ping();
            });
        }, 30000);
    }
    async handleMessage(ws, data) {
        try {
            const event = JSON.parse(data);
            switch (event.event) {
                case 'send_message':
                    await this.handleSendMessage(ws, event);
                    break;
                case 'message_read':
                    await this.handleMessageRead(ws, event);
                    break;
                case 'user_typing':
                    this.handleUserTyping(ws, event);
                    break;
            }
        }
        catch (error) {
            console.error('Erreur WebSocket:', error);
        }
    }
    async handleSendMessage(ws, event) {
        const message = await messageModel_1.default.create({
            match_id: event.match_id,
            sender_id: ws.userId,
            content: event.content,
            created_at: new Date()
        });
        const messageEvent = {
            event: 'receive_message',
            match_id: event.match_id,
            receiver_id: event.receiver_id,
            content: event.content,
            message_id: message._id.toString(),
            created_at: message.created_at,
            sender_id: ws.userId
        };
        this.sendToUser(event.receiver_id, messageEvent);
        this.sendToClient(ws, messageEvent);
    }
    async handleMessageRead(ws, event) {
        await messageModel_1.default.findByIdAndUpdate(event.message_id, {
            read_at: new Date()
        });
        const readEvent = {
            event: 'message_read_confirm',
            match_id: event.match_id,
            message_id: event.message_id,
            reader_id: ws.userId,
            sender_id: event.sender_id
        };
        if (event.sender_id) {
            this.sendToUser(event.sender_id, readEvent);
        }
        this.sendToClient(ws, readEvent);
    }
    handleUserTyping(ws, event) {
        const typingEvent = {
            event: 'user_typing_display',
            match_id: event.match_id,
            sender_id: ws.userId,
            receiver_id: event.receiver_id
        };
        this.sendToUser(event.receiver_id, typingEvent);
    }
    handleDisconnect(ws) {
        if (ws.userId) {
            this.clients.delete(ws.userId);
        }
    }
    sendToUser(userId, event) {
        const client = this.clients.get(userId);
        if (client) {
            this.sendToClient(client, event);
        }
    }
    sendToClient(ws, event) {
        ws.send(JSON.stringify(event));
    }
    broadcastNewMatch(matchData) {
        if ('user1_id' in matchData && 'user2_id' in matchData) {
            this.sendToUser(matchData.user1_id, matchData);
            this.sendToUser(matchData.user2_id, matchData);
        }
    }
}
exports.WebSocketManager = WebSocketManager;
//# sourceMappingURL=WebSocketManager.js.map