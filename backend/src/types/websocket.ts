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
  | 'notification';

export interface BaseWebSocketEvent {
  event: WebSocketEventType;
}

export interface MessageEvent extends BaseWebSocketEvent {
  match_id: string;
  sender_id?: string;
  receiver_id: string;
  content: string;
  message_id?: string;
  created_at?: Date;
}

export interface MessageReadEvent extends BaseWebSocketEvent {
  match_id: string;
  message_id: string;
  reader_id?: string;
  sender_id?: string;
}

export interface TypingEvent extends BaseWebSocketEvent {
  match_id: string;
  sender_id?: string;
  receiver_id: string;
}

export interface MatchEvent extends BaseWebSocketEvent {
  match_id: string;
  user1_id: string;
  user2_id: string;
}

export interface ConnectEvent extends BaseWebSocketEvent {
  message: string;
}

export type WebSocketEvent = 
  | MessageEvent 
  | MessageReadEvent 
  | TypingEvent 
  | MatchEvent 
  | ConnectEvent;

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