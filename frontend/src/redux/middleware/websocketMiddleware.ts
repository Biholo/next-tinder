import { Middleware } from '@reduxjs/toolkit';
import { clearTypingStatus, removeUserOnlineStatus, setConnectionStatus, setLastMessage, setNewMatch, setTypingStatus, setUserOnlineStatus } from '@/redux/slices/websocketSlice';
import { removeMatch } from '@/redux/slices/matcheSlice';
import { addConversation, updateLastMessage } from '@/redux/slices/conversationSlice';
import { addMessage } from '@/redux/slices/messageSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { wsService } from '@/services/websocketService';

const websocketMiddleware: Middleware<{}, RootState, AppDispatch> = (store) => {
    return (next) => (action: any) => {
        switch (action.type) {
            case 'websocket/connect':
                wsService.connect();

                /** Lorsqu'un message est reçu */
                wsService.addEventListener('receive_message', (data: any) => {
                    store.dispatch(addMessage(data));
                });

                /** Confirmation de lecture */
                wsService.addEventListener('message_read_confirm', (data: any) => {
                    console.log('Message lu:', data);
                });

                /** Indicateur "En train d’écrire" */
                wsService.addEventListener('user_typing_display', (data: any) => {
                  if(data.is_typing) {
                    store.dispatch(setTypingStatus(data));
                  } else {
                    store.dispatch(clearTypingStatus(data.match_id));
                  }
                });

                /** Nouveaux matchs */
                wsService.addEventListener('new_match', (data: any) => {
                    store.dispatch(setNewMatch(data));
                });

                /** Statut en ligne */
                wsService.addEventListener('user_connected', (data: any) => {
                    store.dispatch(setUserOnlineStatus(data));
                });

                /** Statut en ligne */
                wsService.addEventListener('online_status', (data: any) => {
                    console.log('🔹 online_status:', data)
                    store.dispatch(setUserOnlineStatus(data));
                });

                /** Déconnexion d'un utilisateur */
                wsService.addEventListener('user_disconnected', (data: any) => {
                    store.dispatch(removeUserOnlineStatus(data));
                });

                store.dispatch(setConnectionStatus(true));
                break;

            case 'websocket/disconnect':
                wsService.disconnect();
                store.dispatch(setConnectionStatus(false));
                break;

            case 'websocket/sendMessage':
                wsService.sendMessage(action.payload.matchId, action.payload.content);
                break;

            default:
                break;
        }

        return next(action);
    };
};

export default websocketMiddleware;
