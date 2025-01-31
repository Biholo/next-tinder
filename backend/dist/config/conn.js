"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connect = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI non définie dans les variables d\'environnement');
        }
        await mongoose_1.default.connect(uri);
        console.log('✅ Connecté à MongoDB');
    }
    catch (error) {
        console.error('❌ Erreur lors de la connexion à MongoDB :', error);
        process.exit(1);
    }
};
exports.default = connect;
//# sourceMappingURL=conn.js.map