"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSwipe = void 0;
const swipeModel_1 = __importDefault(require("@/models/swipeModel"));
const matchModel_1 = __importDefault(require("@/models/matchModel"));
const createSwipe = async (req, res) => {
    try {
        const user = req.user;
        const { target_user_id, type } = req.body;
        const existingSwipe = await swipeModel_1.default.findOne({
            user_id: user._id,
            target_user_id
        });
        if (existingSwipe) {
            return res.status(400).json({ message: "Vous avez déjà swipé cet utilisateur" });
        }
        const swipe = await swipeModel_1.default.create({
            user_id: user._id,
            target_user_id,
            type
        });
        if (type === 'LIKE') {
            const reciprocalSwipe = await swipeModel_1.default.findOne({
                user_id: target_user_id,
                target_user_id: user._id,
                type: 'LIKE'
            });
            if (reciprocalSwipe) {
                await matchModel_1.default.create({
                    user1_id: user._id,
                    user2_id: target_user_id
                });
                return res.json({
                    message: "Match créé !",
                    match: true,
                    swipe
                });
            }
        }
        return res.json({
            message: "Swipe enregistré",
            match: false,
            swipe
        });
    }
    catch (error) {
        console.error("Erreur lors de la création du swipe :", error);
        return res.status(500).json({ message: "Erreur lors de la création du swipe" });
    }
};
exports.createSwipe = createSwipe;
//# sourceMappingURL=swipeController.js.map