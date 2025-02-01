export type WebSocketEventType = 
  | 'connect'
  | 'disconnect'
  | 'send_message'
  | 'receive_message'
  | 'message_read'
  | 'message_read_confirm'
  | 'new_match'
  | 'user_typing'
  | 'user_typing_display'
  | 'notification'
  | 'swipe'
  | 'online_status'
  | 'request_online_status'
  | 'user_connected'
  | 'user_disconnected';

export interface Message {
  match_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_id?: string;
  created_at: string;
}

export interface MessageRead {
  match_id: string;
  message_id: string;
  reader_id: string;
}

export interface NewMatch {
  match_id: string;
  user_id: string;
  first_name: string;
  photo: string;
  created_at: string;
}

export interface UserTyping {
  match_id: string;
  sender_id: string;
}

export interface Notification {
  type: 'message' | 'match';
  message: string;
  data: any;
  created_at: string;
}

export interface BaseWebSocketEvent {
  event: WebSocketEventType;
}

export interface UserStatusEvent extends BaseWebSocketEvent {
  event: 'user_connected' | 'user_disconnected';
  user_id: string;
}

export interface MessageEvent extends BaseWebSocketEvent {
  event: 'send_message' | 'receive_message';
  match_id: string;
  sender_id?: string;
  receiver_id: string;
  content: string;
  message_id?: string;
  created_at?: Date;
}

export interface MessageReadEvent extends BaseWebSocketEvent {
  event: 'message_read' | 'message_read_confirm';
  match_id: string;
  message_id: string;
  reader_id?: string;
  sender_id?: string;
}

export interface TypingEvent extends BaseWebSocketEvent {
  event: 'user_typing' | 'user_typing_display';
  match_id: string;
  sender_id?: string;
  receiver_id: string;
}

export interface MatchEvent extends BaseWebSocketEvent {
  event: 'new_match';
  match_id: string;
  user: {
    _id: string;
    photos: Array<{ _id: string, photoUrl: string }>;
    age: number;
    firstName?: string;
    lastName?: string;
    [key: string]: any;
  };
  lastMessage: any | null;
  createdAt: Date;
}

export interface ConnectEvent extends BaseWebSocketEvent {
  event: 'connect';
  message: string;
}

export interface OnlineStatusEvent extends BaseWebSocketEvent {
  event: 'online_status';
  userId: string;
  onlineStatuses: Array<{ userId: string; isOnline: boolean }>;
}

export interface RequestOnlineStatusEvent extends BaseWebSocketEvent {
  event: 'request_online_status';
  userId: string;
}

export type WebSocketEvent = 
  | MessageEvent 
  | MessageReadEvent 
  | TypingEvent 
  | MatchEvent 
  | ConnectEvent
  | UserStatusEvent
  | OnlineStatusEvent
  | RequestOnlineStatusEvent;