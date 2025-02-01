import MatchModel from "@/models/matchModel";
import MessageModel from "@/models/messageModel";
import UserModel from "@/models/userModel";
import UserPhotoModel from "@/models/userPhotoModel";

interface MatchDetails {
  match_id: string;
  user: {
    _id: string;
    photos: Array<{ _id: string, photoUrl: string }>;
    age: number;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    [key: string]: any;
  };
  lastMessage: any | null;
  createdAt: Date;
}

export class MatchService {
  public async getMatchedUserIds(userId: string): Promise<string[]> {
    try {
      const matches = await MatchModel.find({
        $or: [{ user1_id: userId }, { user2_id: userId }]
      });

      return matches.map(match => 
        match.user1_id.toString() === userId
          ? match.user2_id.toString()
          : match.user1_id.toString()
      );
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des matches:', error);
      return [];
    }
  }

  public async getMatchWithDetails(matchId: string, currentUserId: string): Promise<MatchDetails | null> {
    const match = await MatchModel.findById(matchId).lean();
    if (!match) return null;

    const otherUserId = match.user1_id.toString() === currentUserId
      ? match.user2_id
      : match.user1_id;

    // Récupérer l'utilisateur avec ses photos
    const otherUser = await UserModel.findById(otherUserId).lean();
    if (!otherUser) return null;

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
      match_id: match._id.toString(),
      user: {
        ...otherUser,
        _id: otherUser._id.toString(),
        photos: photos.map(photo => ({
          _id: photo._id.toString(),
          photoUrl: photo.photoUrl
        })),
        age,
        dateOfBirth: undefined
      },
      lastMessage: lastMessage || null,
      createdAt: match.createdAt
    };
  }
} 