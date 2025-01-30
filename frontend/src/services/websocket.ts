import { WebSocketEvent } from '@/models/websocket';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initialize();
  }

  private initialize() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.ws = new WebSocket(`${process.env.REACT_APP_WS_URL}?token=${token}`);

    this.ws.onopen = () => {
      console.log('WebSocket connecté');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const data: WebSocketEvent = JSON.parse(event.data);
      this.notifyListeners(data.event, data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket déconnecté');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Nombre maximum de tentatives de reconnexion atteint');
      return;
    }

    this.reconnectAttempts++;
    setTimeout(() => {
      console.log(`Tentative de reconnexion ${this.reconnectAttempts}...`);
      this.initialize();
    }, 5000 * this.reconnectAttempts);
  }

  public addEventListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  public removeEventListener(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    callbacks?.forEach(callback => callback(data));
  }

  public sendMessage(matchId: string, receiverId: string, content: string) {
    this.send({
      event: 'send_message',
      match_id: matchId,
      receiver_id: receiverId,
      content,
      created_at: new Date().toISOString()
    });
  }

  public markMessageAsRead(matchId: string, messageId: string) {
    this.send({
      event: 'message_read',
      match_id: matchId,
      message_id: messageId
    });
  }

  public sendTypingStatus(matchId: string, receiverId: string) {
    this.send({
      event: 'user_typing',
      match_id: matchId,
      receiver_id: receiverId
    });
  }

  private send(data: WebSocketEvent) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  public disconnect() {
    this.ws?.close();
  }
}

// Export une instance singleton
export const wsService = new WebSocketService(); 