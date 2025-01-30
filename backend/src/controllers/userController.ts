import { Request, Response, RequestHandler } from "express";
import UserModel from "@/models/userModel";
import { IUser } from '@/models/userModel';
import { IMatch } from '../models/matchModel';
import { ISwipe } from '../models/swipeModel';
import SwipeModel from "@/models/swipeModel";
import MatchModel from "@/models/matchModel";
import { AuthRequest } from "@/types/auth";
import { IUserPhoto } from "@/models/userPhotoModel";
import UserPhotoModel from "@/models/userPhotoModel";

interface IUserWithPreferences extends IUser {
  preferences?: {
    gender?: 'male' | 'female' | 'both';
    ageRange?: {
      min: number;
      max: number;
    };
  };
}

interface TypedRequestHandler extends RequestHandler {
  (req: Request, res: Response): Promise<void>;
}

export const getProfilesToSwipe: TypedRequestHandler = async (req, res) => {
    try {
      const currentUser = (req as AuthRequest).user as IUserWithPreferences;
      if (!currentUser) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
  
      // Récupérer les IDs des utilisateurs déjà swipés
      const swipedUsers = await SwipeModel.find({ 
        user_id: currentUser._id 
      }).distinct('target_user_id');
  
      // Récupérer les IDs des matchs existants
      const matches = await MatchModel.find({
        $or: [
          { user1_id: currentUser._id },
          { user2_id: currentUser._id }
        ]
      }).lean();
  
      const matchedUserIds = matches.map(match => 
        //@ts-ignore
        match.user1_id.toString() === currentUser._id.toString() 
          ? match.user2_id 
          : match.user1_id
      );
  
      // Exclure l'utilisateur actuel, les utilisateurs swipés et les matchs
      const excludedIds = [
        currentUser._id,
        ...swipedUsers,
        ...matchedUserIds
      ];
  
      // Construire la requête en fonction des préférences de l'utilisateur
      const query: Record<string, any> = { _id: { $nin: excludedIds } };
  
      if (currentUser.preferences?.gender && currentUser.preferences.gender !== 'both') {
        query.gender = currentUser.preferences.gender;
      }
  
      if (currentUser.preferences?.ageRange) {
        const today = new Date();
        const minDate = new Date(today.getFullYear() - currentUser.preferences.ageRange.max, today.getMonth(), today.getDate());
        const maxDate = new Date(today.getFullYear() - currentUser.preferences.ageRange.min, today.getMonth(), today.getDate());
  
        query.birth_date = { $gte: minDate, $lte: maxDate };
      }
  
      const limit = Number(req.query.limit) || 10; // Permettre une pagination
      const profiles = await UserModel.find(query)
        .select('first_name last_name bio photos gender birth_date')
        .limit(limit)
        .lean();
  
      return res.json(profiles);
    } catch (error) {
      console.error("Erreur lors de la récupération des profils :", error);
      return res.status(500).json({ message: "Erreur lors de la récupération des profils" });
    }
  };
  
  export const updateCurrentUser: TypedRequestHandler = async (req, res) => {
    try {
      const allowedUpdates = ['bio', 'location', 'first_name', 'last_name']; // Champs modifiables
      const updates = Object.keys(req.body).reduce((acc, key) => {
        if (allowedUpdates.includes(key)) acc[key] = req.body[key];
        return acc;
      }, {} as Partial<IUser>);
  
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "Aucune mise à jour valide fournie" });
      }
  
      const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true, select: 'first_name last_name bio location' }
      ).lean();
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      return res.json(user);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      return res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
    }
  };
  
  export const updatePictures: TypedRequestHandler = async (req, res) => {
    try {
      const user = (req as AuthRequest).user;
      const pictures = req.body.pictures; // Supposé être un tableau d'URLs
  
      if (!Array.isArray(pictures) || pictures.length === 0) {
        return res.status(400).json({ message: "Aucune image valide fournie" });
      }
  
      // Vérifier le nombre de photos déjà existantes
      const existingPhotos = await UserPhotoModel.find({ userId: user._id }).lean();
      if (existingPhotos.length + pictures.length > 5) {
        return res.status(400).json({ message: "Vous ne pouvez ajouter que 5 photos maximum" });
      }
  
      // Enregistrer les nouvelles photos
      const newPhotos = pictures.map(photo => ({
        userId: user._id,
        photoUrl: photo
      }));
  
      await UserPhotoModel.insertMany(newPhotos);
  
      // Retourner toutes les photos mises à jour
      const updatedPhotos = await UserPhotoModel.find({ userId: user._id }).select('photoUrl').lean();
  
      return res.json({ message: "Images mises à jour avec succès", photos: updatedPhotos });
    } catch (error) {
      console.error("Erreur lors de l'ajout des images :", error);
      return res.status(500).json({ message: "Erreur lors de l'ajout des images" });
    }
  };
  