import { 
  WebSocketEvent, 
  MessageEvent, 
  SwipeEvent, 
  UserConnectionEvent,
  WebSocketEventType,
  RequestOnlineStatusEvent
} from '@/models';

import Cookies from 'js-cookie';

type WebSocketCallback = (data: WebSocketEvent) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, WebSocketCallback[]> = new Map();

  connect() {
    console.log('🔍 Début de la tentative de connexion WebSocket');
    
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    const token = Cookies.get('accessToken');
    
    if (!token) {
      return;
    }

    const wsUrl = `${import.meta.env.VITE_API_BASE_URL_WS}?token=${token}`;
    
    
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connecté avec succès. ReadyState:', this.ws?.readyState);
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketEvent = JSON.parse(event.data);
          console.log('📥 Message WebSocket reçu:', {
            event: data.event,
            data: data,
            timestamp: new Date().toISOString()
          });
          this.notifyListeners(data.event, data);
        } catch (error) {
          console.error('❌ Erreur de parsing WebSocket:', error);
          console.log('📦 Données brutes reçues:', event.data);
        }
      };

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket déconnecté', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          timestamp: new Date().toISOString()
        });
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('❌ Erreur WebSocket:', {
          error,
          readyState: this.ws?.readyState,
          timestamp: new Date().toISOString()
        });
      };
      
    } catch (error) {
      console.error('❌ Erreur lors de la création du WebSocket:', error);
    }
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
  }

  public removeEventListener(event: WebSocketEventType, callback: WebSocketCallback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: WebSocketEventType, data: WebSocketEvent) {
    const callbacks = this.listeners.get(event);
    callbacks?.forEach(callback => callback(data));
  }

  public sendMessage(matchId: string, content: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket non connecté');
      return;
    }
    console.log('🔍 sendMessage:', matchId, content)

    const message: MessageEvent = {
      event: 'send_message',
      match_id: matchId,
      content,
      receiver_id: '' // Sera rempli côté serveur
    };

    this.send(message);
  }

  public markMessageAsRead(matchId: string, messageId: string, senderId: string) {
    this.send({
      event: 'message_read',
      match_id: matchId,
      message_id: messageId,
      sender_id: senderId
    });
  }

  public sendTypingStatus(matchId: string, receiverId: string, isTyping: boolean) {
    this.send({
      event: 'user_typing',
      match_id: matchId,
      receiver_id: receiverId,
      is_typing: isTyping
    });
    }

  private send(data: WebSocketEvent) {
    // console.log('📤 Tentative d\'envoi de message WebSocket:', {
    //   event: data.event,
    //   readyState: this.ws?.readyState,
    //   timestamp: new Date().toISOString()
    // });
    
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('❌ WebSocket non connecté. État:', {
        readyState: this.ws?.readyState,
        readyStateText: this.getReadyStateText(this.ws?.readyState)
      });
    }
  }

  private getReadyStateText(readyState: number | undefined): string {
    switch (readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING (0)';
      case WebSocket.OPEN: return 'OPEN (1)';
      case WebSocket.CLOSING: return 'CLOSING (2)';
      case WebSocket.CLOSED: return 'CLOSED (3)';
      default: return 'UNDEFINED';
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

  public requestOnlineStatus() {
    if (!this.ws) {
      console.error('❌ WebSocket non connecté');
      return;
    }

    const event: RequestOnlineStatusEvent = {
      event: 'request_online_status',
    };

    this.send(event);
    console.log('📤 Demande des statuts en ligne envoyée');
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