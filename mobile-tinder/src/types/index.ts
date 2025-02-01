export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  location?: string;
  bio?: string;
  preferences?: {
    gender: 'male' | 'female' | 'both';
    ageRange: {
      min: number;
      max: number;
    };
  };
  photos?: {
    _id: string;
    photoUrl: string;
  }[];
}

export interface Match {
  _id: string;
  user1_id: string;
  user2_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface SwipeAction {
  target_user_id: string;
  direction: 'LIKE' | 'DISLIKE';
} 