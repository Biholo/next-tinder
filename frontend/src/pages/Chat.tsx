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
import { wsService } from "@/services/websocketService"

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date | string | number;
  createdAt: Date | string | number;
}

interface MessageResponse {
  messages: Message[];
  otherUser: any;
  match: any;
}

export default function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<any>(null);
  
  const [match, setMatch] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { user: currentUser } = useAppSelector(state => state.auth);
  const { typingUsers } = useAppSelector(state => state.websocket);
  const dispatch = useAppDispatch()
  

  // Connexion WebSocket et gestion des événements
  useEffect(() => {
    if (currentUser?._id) {

      const handleNewMessage = (data: any) => {
        if (data.match_id === matchId) {
          const newMessage: Message = {
            id: data.message_id || Date.now().toString(),
            content: data.content,
            senderId: data.sender_id,
            timestamp: data.created_at || new Date(),
            createdAt: data.created_at || new Date(),
          };
          setMessages(prev => [...prev, newMessage]);
          setIsTyping(false); // Réinitialiser l'état de frappe quand un message est reçu
        }
      };

      const handleMessageRead = (data: any) => {
        if (data.match_id === matchId) {
          console.log('Message lu:', data);
        }
      };

      const handleTyping = (data: any) => {
        if (data.match_id === matchId && data.sender_id !== currentUser._id) {
          setIsTyping(true);
          // Réinitialiser après 3 secondes
          setTimeout(() => setIsTyping(false), 3000);
        }
      };

      wsService.addEventListener('receive_message', handleNewMessage);
      wsService.addEventListener('message_read_confirm', handleMessageRead);
      wsService.addEventListener('user_typing_display', handleTyping);

      return () => {
        wsService.removeEventListener('receive_message', handleNewMessage);
        wsService.removeEventListener('message_read_confirm', handleMessageRead);
        wsService.removeEventListener('user_typing_display', handleTyping);
        wsService.disconnect();
      };
    }
  }, [currentUser?._id, matchId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (matchId) {
          const response = await dispatch(getMessages(matchId));
          if ('payload' in response) {
            const { messages: responseMessages, otherUser, match: responseMatch } = response.payload as MessageResponse;
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
    console.log('🔍 sendMessage:', matchId, content)
    wsService.sendMessage(matchId, content);

    // Optimistic update
    // const newMessage: Message = {
    //   id: Date.now().toString(),
    //   content,
    //   timestamp: new Date(),
    //   senderId: currentUser?._id || "",
    // };
    
    // setMessages(prev => [...prev, newMessage]);
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
              {messages.map((message, index) => (
                <MessageBubble 
                  key={index} 
                  message={message} 
                  isOwn={message.senderId === currentUser?._id} 
                />
              ))}
              {isTyping && (
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span>{user?.firstName} est en train d'écrire...</span>
                </div>
              )}
            </div>
            <MessageInput onSendMessage={handleSendMessage} matchId={matchId} receiverId={user?._id} />
          </>
        )}
      </div>
      <div className="w-[400px] border-l">
        {match && <ProfilePanel user={user} />}
      </div>
    </div>
  );
}