import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { NewMatch } from './NewMatch';
import { useAppSelector } from '@/hooks/useAppSelector';

export const NewMatchesList = () => {
  const router = useRouter();
  const { matches } = useAppSelector((state) => state.matches);

  const newMatches = matches.filter(match => !match.lastMessage);

  if (newMatches.length === 0) return null;

  return (
    <View className="mt-4">
      <Text className="text-white font-bold text-lg px-4 mb-4">Nouveaux Matchs</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-4"
      >
        {newMatches.map((match) => (
          <NewMatch
            key={match._id}
            match={match}
            onPress={() => router.push(`/stack/conversation?id=${match._id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}; 