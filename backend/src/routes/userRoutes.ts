import express from "express";
import { getProfilesToSwipe, updateCurrentUser, updatePictures } from "@/controllers/userController";
import { updateUserSchema, updatePhotosSchema } from "@/validators/userValidator";
import { validate } from "@/middlewares/validate";
import { isAuthenticated } from "@/middlewares/auth";

const router = express.Router();



// Récupérer les profils à swiper
router.get('/', 
    isAuthenticated,
    getProfilesToSwipe
);

// Mettre à jour le profil de l'utilisateur connecté
router.patch(
    '/me', 
    isAuthenticated,
    validate(updateUserSchema, "body"), 
    updateCurrentUser
);

// Ajouter/Mettre à jour les photos de profil
router.post(
    '/photos', 
    isAuthenticated,
    validate(updatePhotosSchema, "body"), 
    updatePictures
);

export default router; 
