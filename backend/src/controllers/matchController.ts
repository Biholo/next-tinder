import { Request, RequestHandler, Response } from "express";
import MatchModel from "@/models/matchModel";
import MessageModel from "@/models/messageModel";
import UserModel from "@/models/userModel";
import UserPhotoModel from "@/models/userPhotoModel";
import { AuthRequest } from "@/types/auth";

interface TypedRequestHandler extends RequestHandler {
  (req: Request, res: Response): Promise<void>;
}

export const getMatches: TypedRequestHandler = async (req, res) => {
  try {
    const user = req.user;

    // Récupérer tous les matches
    const matches = await MatchModel.find({
      $or: [
        { user1_id: user.id },
        { user2_id: user.id }
      ]
    }).lean();

    // Récupérer les utilisateurs et leurs photos
    const matchesWithDetails = await Promise.all(matches.map(async (match) => {
      const otherUserId = match.user1_id.toString() === user.id.toString() 
        ? match.user2_id 
        : match.user1_id;

      // Récupérer l'utilisateur avec ses photos
      const otherUser = await UserModel.findById(otherUserId).lean();
      const photos = await UserPhotoModel.find({ userId: otherUserId }).lean();
      
      // Récupérer le dernier message
      const lastMessage = await MessageModel.findOne({
        matchId: match._id
      })
      .sort({ createdAt: -1 })
      .lean();

      // Calculer l'âge
      const birthDate = new Date(otherUser?.dateOfBirth || '');
      const age = new Date().getFullYear() - birthDate.getFullYear();

      return {
        match_id: match._id,
        user: {
          ...otherUser,
          photos: photos.map(photo => ({
            _id: photo._id,
            photoUrl: photo.photoUrl
          })),
          age,
          dateOfBirth: undefined
        },
        lastMessage: lastMessage || null,
        createdAt: match.createdAt
      };
    }));

    return res.json({
      message: "Matchs récupérés avec succès",
      data: matchesWithDetails
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des matchs :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des matchs" });
  }
};
