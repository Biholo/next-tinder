"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatches = void 0;
const matchModel_1 = __importDefault(require("@/models/matchModel"));
const getMatches = async (req, res) => {
    try {
        const user = req.user;
        const matches = await matchModel_1.default.find({
            $or: [
                { user1_id: user._id },
                { user2_id: user._id }
            ]
        })
            .populate('user1_id', 'first_name last_name photos')
            .populate('user2_id', 'first_name last_name photos')
            .lean();
        return res.json(matches);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des matchs :", error);
        return res.status(500).json({ message: "Erreur lors de la récupération des matchs" });
    }
};
exports.getMatches = getMatches;
//# sourceMappingURL=matchController.js.map