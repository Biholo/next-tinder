import express from "express";
import { getProfilesToSwipe, updateCurrentUser, updatePictures } from "@/controllers/userController";
import { updateUserValidator } from "@/validators/userValidator";
import { validateRequest } from "@/middleware/validateRequest";
import { authenticate } from "@/middleware/authenticate";

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Récupérer les profils à swiper
router.get('/', getProfilesToSwipe);

// Mettre à jour le profil de l'utilisateur connecté
router.patch('/me', updateUserValidator, validateRequest, updateCurrentUser);

export default router; 
