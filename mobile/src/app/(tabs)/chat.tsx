import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header, SearchBar, ChatListItem, NewMatchesList } from '@/components';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { wsService } from '@/services/websocketService';
import { getMatches } from '@/redux/slices/matcheSlice';

export default function ChatScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { matches, loading } = useAppSelector((state) => state.matches);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getMatches());
      wsService.connect();

      const handleNewMessage = (data: any) => {
        console.log('Nouveau message reçu:', data);
      };

      wsService.addEventListener('receive_message', handleNewMessage);

      return () => {
        wsService.removeEventListener('receive_message', handleNewMessage);
      };
    }
  }, [currentUser?._id, dispatch]);

  const handleChatPress = (matchId: string) => {
    router.push(`/chat/${matchId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Header 
        logoUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mJXBl7iepu0PcsBCV3p2hq90HAMcku.png"
        showSettingsButton 
      />
      <SearchBar placeholder={`Rechercher ${matches.length} Matches`} />
      
      <ScrollView className="flex-1">
        <NewMatchesList />
        
        <View className="mt-6 px-4">
          <Text className="text-white font-bold text-lg mb-4">Messages</Text>
          
          {matches.map((match) => (
            <TouchableOpacity key={match._id} onPress={() => handleChatPress(match._id)}>
              <ChatListItem
                name={match.otherUser.firstName}
                message={match.lastMessage?.content || "Commencez une conversation"}
                status={match.otherUser.online ? 'online' : 'offline'}
                action={match.lastMessage ? '' : "NOUVEAU MATCH"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
