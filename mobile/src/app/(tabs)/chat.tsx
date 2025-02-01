import React from 'react';
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header, SearchBar, ChatListItem, NewMatchesList } from '@/components';

export default function ChatScreen() {
    const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-black">
      <Header 
        logoUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mJXBl7iepu0PcsBCV3p2hq90HAMcku.png"
        showSettingsButton 
      />
      <SearchBar placeholder="Rechercher 21 Matches" />
      
      <ScrollView className="flex-1">
        <NewMatchesList />
        
        <View className="mt-6 px-4">
          <Text className="text-white font-bold text-lg mb-4">Messages</Text>
          
          {chatData.map((chat) => (
            <ChatListItem key={chat.name} {...chat} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const chatData = [
  { 
    name: 'Angelina',
    message: 'Activité récente, matché des mai...',
    status: 'online',
    action: "T'A ENVOYÉ UN LIKE",
  },
  // ... autres données
];
