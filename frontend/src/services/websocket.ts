import { 
  WebSocketEvent, 
  MessageEvent, 
  MessageReadEvent, 
  TypingEvent,
  WebSocketEventType 
} from '@/models';
import Cookies from 'js-cookie';

type WebSocketCallback = (data: WebSocketEvent) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, WebSocketCallback[]> = new Map();

  connect(): void {
      if (this.ws?.readyState === WebSocket.OPEN) return;

      const token = Cookies.get('accessToken');
      if (!token) {
          console.error('Token non trouvé');
          return;
      }

      this.ws = new WebSocket(`ws://localhost:3001?token=${token}`);

      this.ws.onopen = () => {
          console.log('WebSocket connecté');
          this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
          try {
              const data: WebSocketEvent = JSON.parse(event.data);
              this.notifyListeners(data.event, data);
          } catch (error) {
              console.error('Erreur de parsing WebSocket:', error);
          }
      };

      this.ws.onclose = () => {
          console.log('WebSocket déconnecté');
          this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
          console.error('Erreur WebSocket:', error);
      };
  }

  private attemptReconnect(): void {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('Nombre maximum de tentatives de reconnexion atteint');
          return;
      }

      this.reconnectAttempts++;
      setTimeout(() => {
          console.log(`Tentative de reconnexion ${this.reconnectAttempts}...`);
          this.connect();
      }, 5000 * this.reconnectAttempts);
  }

  public addEventListener(event: WebSocketEventType, callback: WebSocketCallback): void {
      if (!this.listeners.has(event)) {
          this.listeners.set(event, []);
      }
      this.listeners.get(event)?.push(callback);
  }

  public removeEventListener(event: WebSocketEventType, callback: WebSocketCallback): void {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
          const index = callbacks.indexOf(callback);
          if (index !== -1) {
              callbacks.splice(index, 1);
          }
      }
  }

  private notifyListeners(event: WebSocketEventType, data: WebSocketEvent): void {
      const callbacks = this.listeners.get(event);
      callbacks?.forEach(callback => callback(data));
  }

  public sendMessage(matchId: string, content: string): void {
      const message: MessageEvent = {
          event: 'send_message',
          match_id: matchId,
          content
      };

      this.send(message);
  }

  public markMessageAsRead(matchId: string, messageId: string, senderId: string): void {
      const message: MessageReadEvent = {
          event: 'message_read',
          match_id: matchId,
          message_id: messageId,
          sender_id: senderId
      };

      this.send(message);
  }

  public sendTypingStatus(matchId: string, receiverId: string): void {
      const message: TypingEvent = {
          event: 'user_typing',
          match_id: matchId,
          receiver_id: receiverId
      };

      this.send(message);
  }

  private send(data: WebSocketEvent): void {
      if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
      } else {
          console.error('WebSocket non connecté');
      }
  }

  public disconnect(): void {
      if (this.ws) {
          this.ws.close();
          this.ws = null;
      }
  }
}

export const wsService = new WebSocketService();