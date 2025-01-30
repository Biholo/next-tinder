export interface WebSocketEvent {
    event: WebSocketEventType;
    [key: string]: any;
  }
  
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