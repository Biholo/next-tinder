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

// Base event type
export interface BaseWebSocketEvent {
    event: WebSocketEventType;
}

// Event types spécifiques
export interface MessageEvent extends BaseWebSocketEvent {
    match_id: string;
    sender_id?: string;
    receiver_id?: string;
    content: string;
    message_id?: string;
    created_at?: string;
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

// Union type pour tous les événements possibles
export type WebSocketEvent = 
    | MessageEvent 
    | MessageReadEvent 
    | TypingEvent 
    | MatchEvent 
    | ConnectEvent;

// Types de données
export interface WebSocketMessage {
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

export interface WebSocketNotification {
    type: 'message' | 'match';
    message: string;
    data: any;
    created_at: string;
}