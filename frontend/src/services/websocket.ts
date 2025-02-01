import { 
  WebSocketEvent, 
  MessageEvent, 
  SwipeEvent, 
  UserConnectionEvent,
  WebSocketEventType 
} from '@/models';
import Cookies from 'js-cookie';

type WebSocketCallback = (data: WebSocketEvent) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, WebSocketCallback[]> = new Map();

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('🟢 WebSocket déjà connecté');
      return;
    }

    const token = Cookies.get('accessToken');
    if (!token) {
      console.error('❌ Token non trouvé');
      return;
    }

    console.log('🔄 Tentative de connexion WebSocket...');
    this.ws = new WebSocket(`ws://localhost:3001?token=${token}`);

    this.ws.onopen = () => {
      console.log('✅ WebSocket connecté');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WebSocketEvent = JSON.parse(event.data);
        console.log('📥 Message WebSocket reçu:', data.event, data);
        this.notifyListeners(data.event, data);
      } catch (error) {
        console.error('❌ Erreur de parsing WebSocket:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('🔌 WebSocket déconnecté', event.code, event.reason);
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('❌ Erreur WebSocket:', error);
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Nombre maximum de tentatives de reconnexion atteint');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`🔄 Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${delay/1000}s...`);

    setTimeout(() => {
      console.log('🔄 Reconnexion...');
      this.connect();
    }, delay);
  }

  public addEventListener(event: WebSocketEventType, callback: WebSocketCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
    console.log(`👂 Écouteur ajouté pour l'événement: ${event}`);
  }

  public removeEventListener(event: WebSocketEventType, callback: WebSocketCallback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
        console.log(`🗑️ Écouteur supprimé pour l'événement: ${event}`);
      }
    }
  }

  private notifyListeners(event: WebSocketEventType, data: WebSocketEvent) {
    console.log(`📢 Notification des écouteurs pour l'événement: ${event}`);
    const callbacks = this.listeners.get(event);
    callbacks?.forEach(callback => callback(data));
  }

  public sendMessage(matchId: string, content: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket non connecté');
      return;
    }

    const message: MessageEvent = {
      event: 'send_message',
      match_id: matchId,
      content,
      receiver_id: '' // Sera rempli côté serveur
    };

    this.send(message);
    console.log('📤 Message envoyé:', content.substring(0, 50));
  }

  public markMessageAsRead(matchId: string, messageId: string, senderId: string) {
    this.send({
      event: 'message_read',
      match_id: matchId,
      message_id: messageId,
      sender_id: senderId
    });
    console.log('👀 Message marqué comme lu:', messageId);
  }

  public sendTypingStatus(matchId: string, receiverId: string) {
    this.send({
      event: 'user_typing',
      match_id: matchId,
      receiver_id: receiverId
    });
    console.log('⌨️ Statut de frappe envoyé');
  }

  private send(data: WebSocketEvent) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('❌ WebSocket non connecté. État:', this.ws?.readyState);
    }
  }

  public sendSwipe(targetUserId: string, direction: string) {
    const message: SwipeEvent = {
        event: 'swipe',
        target_user_id: targetUserId,
        direction
    };
    this.send(message);
}

  public sendUserDisconnected(userId: string) {
    const message: UserConnectionEvent = {
        event: 'user_disconnected',
        user_id: userId
    };
    this.send(message);
  }

  public disconnect() {
    if (this.ws) {
      console.log('👋 Déconnexion WebSocket');
      this.ws.close(1000, 'Déconnexion normale');
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();