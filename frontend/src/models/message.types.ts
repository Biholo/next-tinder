export interface Message {
    id: string;
    matchId: string;
    senderId: string;
    content: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
    type: 'text' | 'image';
    isOwnMessage?: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
export interface MessagePayload {
    match_id: string;
    content: string;
  }