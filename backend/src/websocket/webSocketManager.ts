import { WebSocket, WebSocketServer } from 'ws';
import { server } from '../app';
import { verifyToken } from '@/utils/jwt';
import { 
  WebSocketEvent, 
  MessageEvent, 
  MessageReadEvent, 
  TypingEvent,
  ConnectEvent
} from '@/types/websocket';
import MessageModel from '@/models/messageModel';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive: boolean;
}

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, AuthenticatedWebSocket>;

  constructor() {
    this.wss = new WebSocketServer({ 
        port: 3001
     });
    this.clients = new Map();
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', async (ws: AuthenticatedWebSocket, request) => {
      try {
        // Authentification via token
        const token = request.url?.split('token=')[1];
        if (!token) {
          ws.close(1008, 'Token manquant');
          return;
        }

        const decoded = await verifyToken(token);
        ws.userId = decoded.userId;
        ws.isAlive = true;

        // Ajouter le client à la map
        this.clients.set(decoded.userId, ws);

        // Envoyer message de bienvenue
        const connectEvent: ConnectEvent = {
          event: 'connect',
          message: 'Bienvenue sur la messagerie en temps réel'
        };
        this.sendToClient(ws, connectEvent);

        // Gérer les messages
        ws.on('message', (data: string) => this.handleMessage(ws, data));

        // Gérer la déconnexion
        ws.on('close', () => this.handleDisconnect(ws));

        // Ping pour garder la connexion active
        ws.on('pong', () => { ws.isAlive = true; });

      } catch (error) {
        ws.close(1008, 'Authentification échouée');
      }
    });

    // Ping périodique
    setInterval(() => {
      this.wss.clients.forEach((ws: WebSocket) => {
        const authWs = ws as AuthenticatedWebSocket;
        if (!authWs.isAlive) return authWs.terminate();
        authWs.isAlive = false;
        authWs.ping();
      });
    }, 30000);
  }

  private async handleMessage(ws: AuthenticatedWebSocket, data: string) {
    try {
      const event: WebSocketEvent = JSON.parse(data);

      switch (event.event) {
        case 'send_message':
          await this.handleSendMessage(ws, event as MessageEvent);
          break;
        case 'message_read':
          await this.handleMessageRead(ws, event as MessageReadEvent);
          break;
        case 'user_typing':
          this.handleUserTyping(ws, event as TypingEvent);
          break;
      }
    } catch (error) {
      console.error('Erreur WebSocket:', error);
    }
  }

  private async handleSendMessage(ws: AuthenticatedWebSocket, event: MessageEvent) {
    const message = await MessageModel.create({
      match_id: event.match_id,
      sender_id: ws.userId,
      content: event.content,
      created_at: new Date()
    });

    const messageEvent: MessageEvent = {
      event: 'receive_message',
      match_id: event.match_id,
      receiver_id: event.receiver_id,
      content: event.content,
      // @ts-ignore
      message_id: message._id.toString(),
      // @ts-ignore
      created_at: message.created_at,
      sender_id: ws.userId
    };

    this.sendToUser(event.receiver_id, messageEvent);
    this.sendToClient(ws, messageEvent);
  }

  private async handleMessageRead(ws: AuthenticatedWebSocket, event: MessageReadEvent) {
    await MessageModel.findByIdAndUpdate(event.message_id, {
      read_at: new Date()
    });

    const readEvent: MessageReadEvent = {
      event: 'message_read_confirm',
      match_id: event.match_id,
      message_id: event.message_id,
      reader_id: ws.userId,
      sender_id: event.sender_id
    };

    if (event.sender_id) {
      this.sendToUser(event.sender_id, readEvent);
    }
    this.sendToClient(ws, readEvent);
  }

  private handleUserTyping(ws: AuthenticatedWebSocket, event: TypingEvent) {
    const typingEvent: TypingEvent = {
      event: 'user_typing_display',
      match_id: event.match_id,
      sender_id: ws.userId,
      receiver_id: event.receiver_id
    };

    this.sendToUser(event.receiver_id, typingEvent);
  }

  private handleDisconnect(ws: AuthenticatedWebSocket) {
    if (ws.userId) {
      this.clients.delete(ws.userId);
    }
  }

  public sendToUser(userId: string, event: WebSocketEvent) {
    const client = this.clients.get(userId);
    if (client) {
      this.sendToClient(client, event);
    }
  }

  private sendToClient(ws: WebSocket, event: WebSocketEvent) {
    ws.send(JSON.stringify(event));
  }

  public broadcastNewMatch(matchData: WebSocketEvent) {
    if ('user1_id' in matchData && 'user2_id' in matchData) {
      this.sendToUser(matchData.user1_id, matchData);
      this.sendToUser(matchData.user2_id, matchData);
    }
  }
} 