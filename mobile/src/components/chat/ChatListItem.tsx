import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { wsService } from '@/services/websocketService';
import { setLastMessage } from '@/redux/slices/websocketSlice';

interface ChatListItemProps {
  match: any;
  onPress: () => void;
  isOnline?: boolean;
  isTyping?: boolean;
}

export const ChatListItem = ({ match, onPress, isOnline = false, isTyping = false }: ChatListItemProps) => {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { lastMessages } = useAppSelector((state) => state.websocket);
  
  const hasMessages = !!match.lastMessage;
  const lastMessage = lastMessages[match.match_id] || match.lastMessage;

  useEffect(() => {
    if (!match.match_id || !currentUser?._id) return;

    const handleNewMessage = (data: any) => {
      if (data.match_id === match.match_id) {
        dispatch(setLastMessage({
          matchId: data.match_id,
          content: data.content,
          timestamp: data.created_at || new Date().toISOString(),
          senderId: data.sender_id
        }));
      }
    };

    wsService.addEventListener('receive_message', handleNewMessage);

    return () => {
      wsService.removeEventListener('receive_message', handleNewMessage);
    };
  }, [match.match_id, currentUser?._id, dispatch]);

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center p-4 border-b border-zinc-800"
    >
      <View className="relative">
        <Image 
          source={{ uri: match.user.photos[0]?.photoUrl || "/placeholder.svg" }}
          className="w-12 h-12 rounded-full"
        />
        {isOnline && (
          <View className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
        )}
      </View>
      
      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-white font-semibold">{match.user.firstName}</Text>
          {lastMessage && (
            <Text className="text-gray-400 text-xs">
              {format(new Date(lastMessage.createdAt || lastMessage.timestamp), "HH:mm", { locale: fr })}
            </Text>
          )}
        </View>
        
        <Text className="text-gray-400 text-sm" numberOfLines={1}>
          {isTyping 
            ? "En train d'écrire..."
            : lastMessage
              ? lastMessage.content
              : `Match le ${format(new Date(match.createdAt), "dd/MM/yyyy", { locale: fr })}`
          }
        </Text>

        {/* Indicateur de message non lu */}
        {lastMessage && lastMessage.senderId !== currentUser?._id && !match.isRead && (
          <View className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#FF4458] rounded-full" />
        )}
      </View>
    </TouchableOpacity>
  );
}; 