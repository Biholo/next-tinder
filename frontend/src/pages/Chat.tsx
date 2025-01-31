"use client"

import { useState, useEffect } from "react"
import { ChatHeader } from "../components/chat/chat-header"
import { MessageInput } from "../components/chat/message-input"
import { MessageBubble } from "../components/chat/message-bubble"
import { ProfilePanel } from "../components/chat/profile-panel"
import { getMessages } from '../redux/slices/messageSlice';
import { useParams } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { wsService } from "@/services/websocket"

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date | string | number;
}

export default function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<any>(null);
  const [match, setMatch] = useState<any>(null);
  const { user: currentUser } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  // Connexion WebSocket et gestion des événements
  useEffect(() => {
    if (currentUser?._id) {
      // Connexion au WebSocket
      wsService.connect(currentUser._id);

      // Écouter les nouveaux messages
      const handleNewMessage = (data: any) => {
        if (data.match_id === matchId) {
          const newMessage: Message = {
            id: data.message_id || Date.now().toString(),
            content: data.content,
            senderId: data.sender_id,
            timestamp: data.created_at || new Date(),
          };
          setMessages(prev => [...prev, newMessage]);
        }
      };

      // Écouter les confirmations de lecture
      const handleMessageRead = (data: any) => {
        if (data.match_id === matchId) {
          // Mettre à jour l'état des messages lus
          console.log('Message lu:', data);
        }
      };

      wsService.addEventListener('receive_message', handleNewMessage);
      wsService.addEventListener('message_read_confirm', handleMessageRead);

      return () => {
        wsService.removeEventListener('receive_message', handleNewMessage);
        wsService.removeEventListener('message_read_confirm', handleMessageRead);
        wsService.disconnect();
      };
    }
  }, [currentUser?._id, matchId]);

  // Chargement initial des messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (matchId) {
          const response = await dispatch(getMessages(matchId));
          if ('payload' in response) {
            const { messages: responseMessages, otherUser, match: responseMatch } = response.payload;
            if (responseMessages) setMessages(responseMessages);
            if (otherUser) setUser(otherUser);
            if (responseMatch) setMatch(responseMatch);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
      }
    };

    fetchMessages();
  }, [dispatch, matchId]);

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !matchId) return;

    // Envoyer via WebSocket
    wsService.sendMessage(matchId, content);

    // Optimistic update
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      senderId: currentUser?._id || "",
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  if (!matchId) {
    return <div className="flex items-center justify-center h-screen">Conversation non trouvée</div>;
  }

  return (
    <div className="inset-0 flex bg-white w-full">
      <div className="w-full flex flex-col overflow-hidden">
        {match && (
          <>
            <ChatHeader match={match} otherUser={user} />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble 
                  key={message.id} 
                  message={message} 
                  isOwn={message.senderId === currentUser?._id} 
                />
              ))}
            </div>
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        )}
      </div>
      <div className="w-[400px] border-l">
        {match && <ProfilePanel user={user} />}
      </div>
    </div>
  );
}