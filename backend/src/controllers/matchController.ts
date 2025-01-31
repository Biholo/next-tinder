import { Request, RequestHandler, Response } from "express";
import MatchModel from "@/models/matchModel";
import MessageModel from "@/models/messageModel";
import { AuthRequest } from "@/types/auth";

interface TypedRequestHandler extends RequestHandler {
  (req: Request, res: Response): Promise<void>;
}

export const getMatches: TypedRequestHandler = async (req, res) => {
  try {
    const user = (req as AuthRequest).user;

    const matches = await MatchModel.find({
      $or: [
        { user1_id: user._id },
        { user2_id: user._id }
      ]
    })
    .populate('user1_id', 'first_name last_name photos')
    .populate('user2_id', 'first_name last_name photos')
    .lean();

    // Récupérer le dernier message pour chaque match
    const matchesWithLastMessage = await Promise.all(matches.map(async (match) => {
      const lastMessage = await MessageModel.findOne({
        match_id: match._id
      })
      .sort({ createdAt: -1 })
      .lean();

      // Déterminer l'autre utilisateur
      // @ts-ignore
      const otherUser = match.user1_id._id.toString() === user._id.toString() 
        ? match.user2_id 
        : match.user1_id;

      return {
        match_id: match._id,
        user: otherUser,
        lastMessage: lastMessage || null,
        createdAt: match.createdAt
      };
    }));

    return res.json({
        message: "Matchs récupérés avec succès",
        data: matchesWithLastMessage
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des matchs :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des matchs" });
  }
};
