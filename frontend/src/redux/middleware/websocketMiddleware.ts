import { Middleware, MiddlewareAPI, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { wsService } from '@/services/websocketService';
import { 
  setTypingStatus, 
  setUserOnlineStatus, 
  addReadMessage, 
  setLastMessage,
  setConnectionStatus 
} from '@/redux/slices/websocketSlice';
import { WebSocketEvent, TypingEvent, MessageEvent, MessageReadEvent } from '@/models/websocket';
import { RootState } from '../store';

const websocketMiddleware = ((store) => (next) => (action) => {
  // Gestion des événements WebSocket
  const handleWebSocketEvent = (data: WebSocketEvent) => {
    const { dispatch } = store;

    switch (data.event) {
      case 'user_typing_display': {
        console.log('🔔 Event received [user_typing_display]:', data);
        const typingEvent = data as TypingEvent;
        dispatch(setTypingStatus({ matchId: typingEvent.match_id, isTyping: true }));
        setTimeout(() => {
          dispatch(setTypingStatus({ matchId: typingEvent.match_id, isTyping: false }));
        }, 3000);
        break;
      }
      case 'user_connected': {
        dispatch(setUserOnlineStatus({ userId: data.user_id, isOnline: true }));
        break;
      }
      case 'user_disconnected': {
        dispatch(setUserOnlineStatus({ userId: data.user_id, isOnline: false }));
        break;
      }
      case 'receive_message': {
        const messageEvent = data as MessageEvent;
        dispatch(setLastMessage({
          matchId: messageEvent.match_id,
          content: messageEvent.content,
          timestamp: messageEvent.created_at?.toISOString() || new Date().toISOString(),
          senderId: messageEvent.sender_id || ''
        }));
        break;
      }
      case 'message_read': {
        const readEvent = data as MessageReadEvent;
        dispatch(addReadMessage({
          matchId: readEvent.match_id,
          messageId: readEvent.message_id
        }));
        break;
      }
    }
  };

  const events = [
    'user_typing_display',
    'user_connected',
    'user_disconnected',
    'receive_message',
    'message_read',
    'new_match'
  ];

  let isConnected = false;
  let currentUserId: string | null = null;

  const handleConnection = () => {
    const state = store.getState() as RootState;
    const { isAuthenticated, user } = state.auth;
    
    if (isAuthenticated && user?._id && !isConnected) {
      console.log('🔌 Tentative de connexion WebSocket...');
      wsService.connect();
      isConnected = true;
      currentUserId = user._id;

      // Ajouter les écouteurs
      events.forEach(event => {
        wsService.addEventListener(event, handleWebSocketEvent);
      });

      // Mise à jour du statut de connexion
      store.dispatch(setConnectionStatus(true));
    }
  };

  // Fonction pour gérer la déconnexion WebSocket
  const handleDisconnection = () => {
    if (isConnected && currentUserId) {
      console.log('👋 Déconnexion WebSocket...');
      wsService.sendUserDisconnected(currentUserId);
      
      // Retirer les écouteurs
      events.forEach(event => {
        wsService.removeEventListener(event, handleWebSocketEvent);
      });

      wsService.disconnect();
      isConnected = false;
      currentUserId = null;
      store.dispatch(setConnectionStatus(false));
    }
  };

  // Vérifier les changements d'état d'authentification
  if ((action as AnyAction).type === 'auth/setUser' || (action as AnyAction).type === 'auth/logout') {
    const state = store.getState() as RootState;
    const { isAuthenticated } = state.auth;

    if (isAuthenticated) {
      handleConnection();
    } else {
      handleDisconnection();
    }
  }

  return next(action);
}) as Middleware;

export default websocketMiddleware; 