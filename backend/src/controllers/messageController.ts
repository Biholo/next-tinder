import { Request, RequestHandler, Response } from "express";
import MessageModel from "@/models/messageModel";
import MatchModel from "@/models/matchModel";
import { AuthRequest } from "@/types/auth";
import UserModel from "@/models/userModel";
import UserPhotoModel from "@/models/userPhotoModel";

interface TypedRequestHandler extends RequestHandler {
  (req: Request, res: Response): Promise<void>;
}

export const createMessage: TypedRequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { match_id, content } = req.body;

    // Vérifier si le match existe et si l'utilisateur en fait partie
    const match = await MatchModel.findOne({
      _id: match_id,
      $or: [
        { user1_id: user.id },
        { user2_id: user.id }
      ]
    });

    if (!match) {
      return res.status(404).json({ message: "Match non trouvé" });
    }

    const message = await MessageModel.create({
      match_id,
      sender_id: user.id,
      content
    });

    return res.json({
        message: "Message envoyé avec succès",
        data: message
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    return res.status(500).json({ message: "Erreur lors de l'envoi du message" });
  }
};

export const getMatchMessages: TypedRequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { match_id } = req.params;

    // Vérifier si le match existe et si l'utilisateur en fait partie
    const match = await MatchModel.findOne({
      _id: match_id,
      $or: [
        { user1_id: user.id },
        { user2_id: user.id }
      ]
    }).lean();

    if (!match) {
      return res.status(404).json({ message: "Match non trouvé" });
    }

    // Récupérer l'ID de l'autre utilisateur
    const otherUserId = match.user1_id.toString() === user.id.toString() 
      ? match.user2_id 
      : match.user1_id;

    // Récupérer les détails complets de l'autre utilisateur avec ses photos
    const otherUser = await UserModel.findById(otherUserId)
      .select('firstName lastName bio gender dateOfBirth location preferences')
      .lean();

    if (!otherUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Récupérer les photos de l'autre utilisateur
    const photos = await UserPhotoModel.find({ userId: otherUserId })
      .select('photoUrl')
      .lean();

    // Calculer l'âge
    const age = otherUser.dateOfBirth 
      ? Math.floor((new Date().getTime() - new Date(otherUser.dateOfBirth).getTime()) / 3.15576e+10)
      : null;

    // Récupérer les messages de la conversation
    const messages = await MessageModel.find({ matchId: match_id })
      .sort({ createdAt: 1 })
      .lean();

    // Formater la réponse
    const formattedResponse = {
      match: {
        _id: match._id,
        createdAt: match.createdAt,
        updatedAt: match.updatedAt
      },
      otherUser: {
        ...otherUser,
        photos,
        age,
        dateOfBirth: undefined // On ne renvoie pas la date de naissance
      },
      messages: messages.map(message => ({
        ...message,
        isOwnMessage: message.senderId.toString() === user.id.toString()
      }))
    };

    return res.json({
      message: "Conversation récupérée avec succès",
      data: formattedResponse
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la conversation :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération de la conversation" });
  }
};
