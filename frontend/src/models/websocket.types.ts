// Types d'événements WebSocket
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
    | 'user_connected'
    | 'user_disconnected';

// Type de base pour tous les événements
export interface BaseWebSocketEvent {
    event: WebSocketEventType;
}

// Types d'événements spécifiques
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

export interface SwipeEvent extends BaseWebSocketEvent {
    event: 'swipe';
    target_user_id: string;
    direction: string;
}

export interface UserConnectionEvent extends BaseWebSocketEvent {
    event: 'user_connected' | 'user_disconnected';
    user_id: string;
}

// Union type de tous les événements possibles
export type WebSocketEvent = 
    | MessageEvent 
    | MessageReadEvent 
    | TypingEvent 
    | MatchEvent 
    | ConnectEvent
    | SwipeEvent
    | UserConnectionEvent;

// Types de données pour les messages
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