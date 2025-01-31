"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePictures = exports.updateCurrentUser = exports.getProfilesToSwipe = void 0;
const userModel_1 = __importDefault(require("@/models/userModel"));
const swipeModel_1 = __importDefault(require("@/models/swipeModel"));
const matchModel_1 = __importDefault(require("@/models/matchModel"));
const userPhotoModel_1 = __importDefault(require("@/models/userPhotoModel"));
const getProfilesToSwipe = async (req, res) => {
    var _a, _b;
    try {
        const currentUser = req.user;
        if (!currentUser) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }
        const swipedUsers = await swipeModel_1.default.find({
            user_id: currentUser._id
        }).distinct('target_user_id');
        const matches = await matchModel_1.default.find({
            $or: [
                { user1_id: currentUser._id },
                { user2_id: currentUser._id }
            ]
        }).lean();
        const matchedUserIds = matches.map(match => match.user1_id.toString() === currentUser._id.toString()
            ? match.user2_id
            : match.user1_id);
        const excludedIds = [
            currentUser._id,
            ...swipedUsers,
            ...matchedUserIds
        ];
        const query = { _id: { $nin: excludedIds } };
        if (((_a = currentUser.preferences) === null || _a === void 0 ? void 0 : _a.gender) && currentUser.preferences.gender !== 'both') {
            query.gender = currentUser.preferences.gender;
        }
        if ((_b = currentUser.preferences) === null || _b === void 0 ? void 0 : _b.ageRange) {
            const today = new Date();
            const minDate = new Date(today.getFullYear() - currentUser.preferences.ageRange.max, today.getMonth(), today.getDate());
            const maxDate = new Date(today.getFullYear() - currentUser.preferences.ageRange.min, today.getMonth(), today.getDate());
            query.birth_date = { $gte: minDate, $lte: maxDate };
        }
        const limit = Number(req.query.limit) || 10;
        const profiles = await userModel_1.default.find(query)
            .select('first_name last_name bio photos gender birth_date')
            .limit(limit)
            .lean();
        return res.json(profiles);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des profils :", error);
        return res.status(500).json({ message: "Erreur lors de la récupération des profils" });
    }
};
exports.getProfilesToSwipe = getProfilesToSwipe;
const updateCurrentUser = async (req, res) => {
    try {
        const allowedUpdates = ['bio', 'location', 'first_name', 'last_name'];
        const updates = Object.keys(req.body).reduce((acc, key) => {
            if (allowedUpdates.includes(key))
                acc[key] = req.body[key];
            return acc;
        }, {});
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "Aucune mise à jour valide fournie" });
        }
        const user = await userModel_1.default.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true, select: 'first_name last_name bio location' }).lean();
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        return res.json(user);
    }
    catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error);
        return res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
    }
};
exports.updateCurrentUser = updateCurrentUser;
const updatePictures = async (req, res) => {
    try {
        const user = req.user;
        const pictures = req.body.pictures;
        if (!Array.isArray(pictures) || pictures.length === 0) {
            return res.status(400).json({ message: "Aucune image valide fournie" });
        }
        const existingPhotos = await userPhotoModel_1.default.find({ userId: user._id }).lean();
        if (existingPhotos.length + pictures.length > 5) {
            return res.status(400).json({ message: "Vous ne pouvez ajouter que 5 photos maximum" });
        }
        const newPhotos = pictures.map(photo => ({
            userId: user._id,
            photoUrl: photo
        }));
        await userPhotoModel_1.default.insertMany(newPhotos);
        const updatedPhotos = await userPhotoModel_1.default.find({ userId: user._id }).select('photoUrl').lean();
        return res.json({ message: "Images mises à jour avec succès", photos: updatedPhotos });
    }
    catch (error) {
        console.error("Erreur lors de l'ajout des images :", error);
        return res.status(500).json({ message: "Erreur lors de l'ajout des images" });
    }
};
exports.updatePictures = updatePictures;
//# sourceMappingURL=userController.js.map