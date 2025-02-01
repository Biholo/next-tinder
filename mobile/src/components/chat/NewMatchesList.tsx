import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { NewMatch } from './NewMatch';
import { useAppSelector } from '@/hooks/useAppSelector';

export const NewMatchesList = () => {
  const router = useRouter();
  const { matches, loading } = useAppSelector((state) => state.matches);
  console.log('🎯 État actuel - Matches:', matches);

  // Sécuriser l'accès aux matches
  if (!matches || loading) return null;

  // Filtrer les matches sans messages
  const newMatches = matches.filter(match => 
    match && match.user && !match.lastMessage
  );

  if (newMatches.length === 0) return null;

  const handleMatchPress = (matchId: string) => {
    if (matchId) {
      router.push(`/stack/conversation?id=${matchId}`);
    }
  };

  return (
    <View className="mt-4">
      <Text className="text-white font-bold text-lg px-4 mb-4">
        Nouveaux Matchs
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-4"
      >
        {newMatches.map((match) => (
          <NewMatch
            key={match._id}
            match={match}
            onPress={() => handleMatchPress(match.match_id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}; 