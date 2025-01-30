import { Request, RequestHandler, Response } from "express";
import MatchModel from "@/models/matchModel";
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

    return res.json(matches);
  } catch (error) {
    console.error("Erreur lors de la récupération des matchs :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des matchs" });
  }
};
