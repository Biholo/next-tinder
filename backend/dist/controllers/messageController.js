"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchMessages = exports.createMessage = void 0;
const messageModel_1 = __importDefault(require("@/models/messageModel"));
const matchModel_1 = __importDefault(require("@/models/matchModel"));
const createMessage = async (req, res) => {
    try {
        const user = req.user;
        const { match_id, content } = req.body;
        const match = await matchModel_1.default.findOne({
            _id: match_id,
            $or: [
                { user1_id: user._id },
                { user2_id: user._id }
            ]
        });
        if (!match) {
            return res.status(404).json({ message: "Match non trouvé" });
        }
        const message = await messageModel_1.default.create({
            match_id,
            sender_id: user._id,
            content
        });
        return res.json(message);
    }
    catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
        return res.status(500).json({ message: "Erreur lors de l'envoi du message" });
    }
};
exports.createMessage = createMessage;
const getMatchMessages = async (req, res) => {
    try {
        const user = req.user;
        const { match_id } = req.params;
        const match = await matchModel_1.default.findOne({
            _id: match_id,
            $or: [
                { user1_id: user._id },
                { user2_id: user._id }
            ]
        });
        if (!match) {
            return res.status(404).json({ message: "Match non trouvé" });
        }
        const messages = await messageModel_1.default.find({ match_id })
            .sort({ created_at: 1 })
            .populate('sender_id', 'first_name last_name')
            .lean();
        return res.json(messages);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        return res.status(500).json({ message: "Erreur lors de la récupération des messages" });
    }
};
exports.getMatchMessages = getMatchMessages;
//# sourceMappingURL=messageController.js.map