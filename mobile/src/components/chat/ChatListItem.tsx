import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAppSelector } from '@/hooks/useAppSelector';

interface ChatListItemProps {
  match: any;
  onPress: () => void;
  isOnline?: boolean;
  isTyping?: boolean;
}

export const ChatListItem = ({ match, onPress, isOnline = false, isTyping = false }: ChatListItemProps) => {
  const hasMessages = !!match.lastMessage;

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
          {hasMessages && (
            <Text className="text-gray-400 text-xs">
              {format(new Date(match.lastMessage.createdAt), "HH:mm", { locale: fr })}
            </Text>
          )}
        </View>
        
        <Text className="text-gray-400 text-sm" numberOfLines={1}>
          {isTyping 
            ? "En train d'écrire..."
            : hasMessages 
              ? match.lastMessage.content
              : `Match le ${format(new Date(match.createdAt), "dd/MM/yyyy", { locale: fr })}`
          }
        </Text>
      </View>
    </TouchableOpacity>
  );
}; 