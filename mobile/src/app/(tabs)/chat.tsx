import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header, SearchBar, ChatListItem, NewMatchesList } from '@/components';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { wsService } from '@/services/websocketService';
import { getMatches } from '@/redux/slices/matcheSlice';
import { Loader } from '@/components';
import { Header as CustomHeader } from '@/components/layout/Header';
import { updateOnlineStatus, setTypingState } from '@/redux/slices/websocketSlice';
import { OnlineStatusEvent } from '@/models/websocket';
import { WebSocketEvent } from '@/models/websocket';


export default function ChatScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { matches, loading } = useAppSelector((state) => state.matches);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { onlineUsers, typingStates } = useAppSelector(state => state.websocket);

  console.log('🎯 État actuel - Matches:', matches);

  useEffect(() => {
    const fetchMatches = async () => {
      if (currentUser?._id) {
        try {
          const response = await dispatch(getMatches()).unwrap();
          console.log('✅ Matches récupérés:', response);
        } catch (error) {
          console.error('❌ Erreur lors de la récupération des matches:', error);
        }
      }
    };

    fetchMatches();
  }, [currentUser?._id, dispatch]);

  useEffect(() => {
    if (currentUser?._id) {
      console.log('🔌 Configuration des écouteurs WebSocket');
      
      const handleNewMessage = (data: any) => {
        console.log('📩 Nouveau message reçu:', data);
        dispatch(getMatches());
      };

      const handleOnlineStatus = (data: WebSocketEvent) => {
        if (data.event === 'online_status') {
          const onlineStatusData = data as OnlineStatusEvent;
          const newStatuses: {[key: string]: boolean} = {};
          onlineStatusData.onlineStatuses.forEach(status => {
            newStatuses[status.userId] = status.isOnline;
          });
            (newStatuses);
        }
      };


      const handleTyping = (data: any) => {
        if (data.sender_id !== currentUser._id) {
          dispatch(setTypingState({ matchId: data.match_id, isTyping: true }));
          // Réinitialiser après 3 secondes
          setTimeout(() => {
            dispatch(setTypingState({ matchId: data.match_id, isTyping: false }));
          }, 3000);
        }
      };

      wsService.addEventListener('receive_message', handleNewMessage);
      wsService.addEventListener('online_status', handleOnlineStatus);
      wsService.addEventListener('user_typing_display', handleTyping);

      return () => {
        wsService.removeEventListener('receive_message', handleNewMessage);
        wsService.addEventListener('online_status', handleOnlineStatus);
        wsService.removeEventListener('user_typing_display', handleTyping);
      };
    }
  }, [currentUser?._id, dispatch]);

  // Filtrer les conversations (matches avec messages)
  const conversations = matches?.filter(match => match.lastMessage) || [];

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <CustomHeader showSettingsButton />
      <SearchBar placeholder={`Rechercher ${matches?.length || 0} Matches`} />
      
      <ScrollView className="flex-1">
        {/* Section Nouveaux Matches */}
        <NewMatchesList />
        
        {/* Section Messages */}
        {conversations.length > 0 ? (
          <View className="mt-6 px-4">
            <Text className="text-white font-bold text-lg mb-4">Messages</Text>
            
            {conversations.map((match) => (
              <TouchableOpacity 
                key={match._id} 
                onPress={() => {
                  console.log('🔀 Navigation vers la conversation:', match.match_id);
                  router.push(`/stack/conversation?id=${match.match_id}`);
                }}
              >
                <ChatListItem
                  match={match}
                  isOnline={onlineUsers[match.user._id] || false}
                  isTyping={typingStates[match.match_id] || false}
                  onPress={() => router.push(`/stack/conversation?id=${match.match_id}`)}
                />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="mt-6 px-4">
            <Text className="text-white text-center">
              Aucune conversation en cours.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
