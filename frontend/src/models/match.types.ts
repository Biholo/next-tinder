import type { Message } from './message.types';
import type { User } from './user.types';

export interface Match {
    id: string;
    user1_id: string;
    user2_id: string;
    createdAt: string;
    updatedAt: string;
    lastMessage?: Message;
    otherUser?: User;
  }
  
export interface MatchResponse {
    match: Match;
    otherUser: User;
    messages: Message[];
  }