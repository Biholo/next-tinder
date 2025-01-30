import { Request, RequestHandler, Response } from "express";
import MessageModel from "@/models/messageModel";
import MatchModel from "@/models/matchModel";
import { AuthRequest } from "@/types/auth";

interface TypedRequestHandler extends RequestHandler {
  (req: Request, res: Response): Promise<void>;
}

export const createMessage: TypedRequestHandler = async (req, res) => {
  try {
    const user = (req as AuthRequest).user;
    const { match_id, content } = req.body;

    // Vérifier si le match existe et si l'utilisateur en fait partie
    const match = await MatchModel.findOne({
      _id: match_id,
      $or: [
        { user1_id: user._id },
        { user2_id: user._id }
      ]
    });

    if (!match) {
      return res.status(404).json({ message: "Match non trouvé" });
    }

    const message = await MessageModel.create({
      match_id,
      sender_id: user._id,
      content
    });

    return res.json(message);
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    return res.status(500).json({ message: "Erreur lors de l'envoi du message" });
  }
};

export const getMatchMessages: TypedRequestHandler = async (req, res) => {
  try {
    const user = (req as AuthRequest).user;
    const { match_id } = req.params;

    // Vérifier si le match existe et si l'utilisateur en fait partie
    const match = await MatchModel.findOne({
      _id: match_id,
      $or: [
        { user1_id: user._id },
        { user2_id: user._id }
      ]
    });

    if (!match) {
      return res.status(404).json({ message: "Match non trouvé" });
    }

    const messages = await MessageModel.find({ match_id })
      .sort({ created_at: 1 })
      .populate('sender_id', 'first_name last_name')
      .lean();

    return res.json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des messages" });
  }
};
