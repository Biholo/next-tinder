import { WebSocket, WebSocketServer } from 'ws';
import { server } from '../app';
import { verifyToken } from '@/utils/jwt';
import { 
  WebSocketEvent, 
  MessageEvent, 
  MessageReadEvent, 
  TypingEvent,
  ConnectEvent,
  MatchEvent,
  SwipeEvent,
  UserStatusEvent,
  OnlineStatusEvent,
  RequestOnlineStatusEvent
} from '@/types/websocket';
import MessageModel from '@/models/messageModel';
import MatchModel from '@/models/matchModel';
import { MatchService } from '@/services/matchService';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive: boolean;
}

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, AuthenticatedWebSocket>;
  private matchService: MatchService;

  constructor() {
    this.wss = new WebSocketServer({ 
        port: process.env.WEBSOCKET_PORT ? parseInt(process.env.WEBSOCKET_PORT, 10) : 3001
     });
    this.clients = new Map();
    this.matchService = new MatchService();
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', async (ws: AuthenticatedWebSocket, request) => {
      try {
        // Authentification via token
        console.log('🔌 Tentative de connexion WebSocket...');
        const token = request.url?.split('token=')[1];
        if (!token) {
          ws.close(1008, 'Token manquant');
          return;
        }

        console.log('🔌 Token reçu:', token);

        const decoded = await verifyToken(token);
        console.log('🔌 Decoded:', decoded);
        // console.log('🔌 Decoded:', decoded);
        ws.userId = decoded.id;
        ws.isAlive = true;

        // Ajouter le client à la map
        this.clients.set(decoded.id, ws);

        // Notifier les matches de la connexion
        await this.notifyUserConnected(decoded.id);

        // Récupér les utilisateurs connectés
        await this.handleRequestOnlineStatus(ws);



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
      console.log('Event received [handleMessage]:', event);


      switch (event.event) {
        case 'send_message':
          console.log('🔍 send_message:', event)
          await this.handleSendMessage(ws, event as MessageEvent);
          break;
        case 'message_read':
          await this.handleMessageRead(ws, event as MessageReadEvent);
          break;
        case 'user_typing':
          this.handleUserTyping(ws, event as TypingEvent);
          break;
        case 'swipe':
          this.handleSwipe(ws, event as SwipeEvent);
          break;
        case 'user_disconnected':
          this.handleUserDisconnected(ws, event as UserStatusEvent);
          break;
        case 'request_online_status':
          this.handleRequestOnlineStatus(ws);
          break;

      }
    } catch (error) {
      console.error('Erreur WebSocket:', error);
    }
  }

  private async handleRequestOnlineStatus(ws: AuthenticatedWebSocket) {
    const userId = ws.userId;
    if (!userId) return;

    const matchedUserIds = await this.matchService.getMatchedUserIds(userId);

    // Récupérer les statuts en ligne
    const onlineStatuses = matchedUserIds.map(matchedUserId => ({
      userId: matchedUserId,
      isOnline: this.clients.has(matchedUserId)
    }));

    // Envoyer les statuts en ligne
    const onlineStatusEvent: OnlineStatusEvent = {
      event: 'online_status',
      userId: userId,
      onlineStatuses: onlineStatuses
    };

    console.log('🔹 onlineStatusEvent:', onlineStatusEvent)
    console.log('Send to user:', userId)

    this.sendToUser(userId, onlineStatusEvent);
  }

  private async handleSwipe(ws: AuthenticatedWebSocket, event: SwipeEvent) {
    const match = await MatchModel.findOne({
      $or: [
        { user1_id: ws.userId, user2_id: event.target_user_id },
        { user1_id: event.target_user_id, user2_id: ws.userId }
      ]
    });

    if (match && ws.userId) {
      // Récupérer les détails du match pour les deux utilisateurs
      const matchDetailsForUser1 = await this.matchService.getMatchWithDetails(match._id.toString(), match.user1_id.toString());
      const matchDetailsForUser2 = await this.matchService.getMatchWithDetails(match._id.toString(), match.user2_id.toString());

      if (matchDetailsForUser1 && matchDetailsForUser2) {
        // Envoyer les détails du match à chaque utilisateur
        const matchEventUser1: MatchEvent = {
          event: 'new_match',
          match_id: matchDetailsForUser1.match_id.toString(),
          user: matchDetailsForUser1.user,
          lastMessage: matchDetailsForUser1.lastMessage,
          createdAt: matchDetailsForUser1.createdAt
        };

        const matchEventUser2: MatchEvent = {
          event: 'new_match',
          match_id: matchDetailsForUser2.match_id.toString(),
          user: matchDetailsForUser2.user,
          lastMessage: matchDetailsForUser2.lastMessage,
          createdAt: matchDetailsForUser2.createdAt
        };

        this.sendToUser(match.user1_id.toString(), matchEventUser1);
        this.sendToUser(match.user2_id.toString(), matchEventUser2);
      }
    }
  }

  private async notifyUserConnected(userId: string) {
    console.log('🔔 Notification de connexion pour:', userId);
    try {
      const matchedUserIds = await this.matchService.getMatchedUserIds(userId);

      for (const otherUserId of matchedUserIds) {
        const statusEvent: UserStatusEvent = {
          event: 'user_connected',
          userId: userId,
          onlineStatus: true
        };

        this.sendToUser(otherUserId, statusEvent);
        console.log(`✅ Notification envoyée à ${otherUserId}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la notification de connexion:', error);
    }
  }

  private async handleUserDisconnected(ws: AuthenticatedWebSocket, event: UserStatusEvent) {
    if (!ws.userId) return;
    
    console.log('🔔 Notification de déconnexion pour:', ws.userId);
    try {
      const matchedUserIds = await this.matchService.getMatchedUserIds(ws.userId);

      const statusEvent: UserStatusEvent = {
        event: 'user_disconnected',
        userId: ws.userId,
        onlineStatus: false
      };

      for (const otherUserId of matchedUserIds) {
        this.sendToUser(otherUserId, statusEvent);
        console.log(`✅ Notification de déconnexion envoyée à ${otherUserId}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la notification de déconnexion:', error);
    }
  }

  private async getReceiverIdFromMatch(matchId: string, senderId: string): Promise<string | null> {
    console.log('🔍 Recherche du receiverId pour le match:', matchId, 'et sender:', senderId);
    try {
      const match = await MatchModel.findById(matchId);
      if (!match) {
        console.error('❌ Match non trouvé');
        return null;
      }
      const receiverId = match.user1_id.toString() === senderId ? match.user2_id.toString() : match.user1_id.toString();
      console.log('✅ ReceiverId trouvé:', receiverId);
      return receiverId;
    } catch (error) {
      console.error('❌ Erreur lors de la recherche du receiverId:', error);
      return null;
    }
  }

  private async handleSendMessage(ws: AuthenticatedWebSocket, event: MessageEvent) {
    console.log('Event received [handleSendMessage]:', event);
    const message = await MessageModel.create({
      matchId: event.match_id,
      senderId: ws.userId,
      content: event.content,
      createdAt: new Date()
    });

    const receiverId = await this.getReceiverIdFromMatch(event.match_id, ws.userId || '');
    if (!receiverId) {
      console.error('❌ Impossible de déterminer le destinataire');
      return;
    }

    const messageEvent: MessageEvent = {
      event: 'receive_message',
      match_id: event.match_id,
      receiver_id: receiverId,
      content: event.content,
      message_id: message._id.toString(),
      created_at: message.createdAt,
      sender_id: ws.userId
    };

    this.sendToUser(receiverId, messageEvent);
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
      receiver_id: event.receiver_id,
      is_typing: event.is_typing
    };
    console.log('🔔 TypingEvent:', typingEvent);
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

  public broadcastNewMatch(user1Id: string, user2Id: string) {
    this.handleSwipe({ userId: user1Id } as AuthenticatedWebSocket, { target_user_id: user2Id, direction: 'LIKE' } as SwipeEvent);
  }
} 