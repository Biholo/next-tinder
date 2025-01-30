import { Request, RequestHandler, Response } from "express";
import SwipeModel from "@/models/swipeModel";
import MatchModel from "@/models/matchModel";
import { AuthRequest } from "@/types/auth";

interface TypedRequestHandler extends RequestHandler {
  (req: Request, res: Response): Promise<void>;
}

export const createSwipe: TypedRequestHandler = async (req, res) => {
  try {
    const user = (req as AuthRequest).user;
    const { target_user_id, type } = req.body;

    // Vérifier si un swipe existe déjà
    const existingSwipe = await SwipeModel.findOne({
      user_id: user._id,
      target_user_id
    });

    if (existingSwipe) {
      return res.status(400).json({ message: "Vous avez déjà swipé cet utilisateur" });
    }

    // Créer le swipe
    const swipe = await SwipeModel.create({
      user_id: user._id,
      target_user_id,
      type
    });

    // Si c'est un LIKE, vérifier s'il y a un match
    if (type === 'LIKE') {
      const reciprocalSwipe = await SwipeModel.findOne({
        user_id: target_user_id,
        target_user_id: user._id,
        type: 'LIKE'
      });

      if (reciprocalSwipe) {
        // Créer un match
        await MatchModel.create({
          user1_id: user._id,
          user2_id: target_user_id
        });

        return res.json({ 
          message: "Match créé !",
          match: true,
          swipe 
        });
      }
    }

    return res.json({ 
      message: "Swipe enregistré",
      match: false,
      swipe 
    });
  } catch (error) {
    console.error("Erreur lors de la création du swipe :", error);
    return res.status(500).json({ message: "Erreur lors de la création du swipe" });
  }
};
