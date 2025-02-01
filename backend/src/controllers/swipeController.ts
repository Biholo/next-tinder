import { Request, RequestHandler, Response } from "express";
import SwipeModel from "@/models/swipeModel";
import MatchModel from "@/models/matchModel";
import { AuthRequest } from "@/types/auth";

interface TypedRequestHandler extends RequestHandler {
  (req: Request, res: Response): Promise<void>;
}

export const createSwipe: TypedRequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { target_user_id, direction } = req.body;
    
    // Vérifier si un swipe existe déjà
    const existingSwipe = await SwipeModel.findOne({
      userId: user.id,
      targetId: target_user_id
    });

    if (existingSwipe) {
      return res.status(400).json({ message: "Vous avez déjà swipé cet utilisateur" });
    }

    // Créer le swipe
    const swipe = await SwipeModel.create({
      userId: user.id,
      targetId: target_user_id,
      direction
    });

    // Si c'est un LIKE, vérifier s'il y a un match
    if (direction === 'LIKE') {
      const reciprocalSwipe = await SwipeModel.findOne({
        userId: target_user_id,
        targetId: user.id,
        direction: 'LIKE'
      });

      if (reciprocalSwipe) {
        // Créer un match
        await MatchModel.create({
          user1_id: user.id,
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
      data: {
        match: false,
        swipe 
      }
    });
  } catch (error) {
    console.error("Erreur lors de la création du swipe :", error);
    return res.status(500).json({ message: "Erreur lors de la création du swipe" });
  }
};
