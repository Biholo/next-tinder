import { View, Text, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NewMatch = {
  id: string;
  name: string;
  imageUrl?: string;
  isVerified?: boolean;
};

const newMatches: NewMatch[] = [
  { id: 'likes', name: 'Likes' },
  { id: '1', name: 'Lea', imageUrl: '/placeholder.svg' },
  { id: '2', name: 'Nawres', imageUrl: '/placeholder.svg', isVerified: true },
  { id: '3', name: 'Marie-L', imageUrl: '/placeholder.svg' },
];

export function NewMatchesList() {
  return (
    <View className="mt-4">
      <View className="px-4 flex-row items-center">
        <Text className="text-white font-bold text-lg">Nouveaux Matches</Text>
        <View className="ml-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
          <Text className="text-white text-xs">6</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 px-2">
        {newMatches.map((match) => (
          <View key={match.id} className="mx-2">
            {match.id === 'likes' ? (
              <>
                <View className="w-16 h-16 rounded-full border-2 border-yellow-500 items-center justify-center">
                  <View className="w-14 h-14 rounded-full bg-yellow-500 items-center justify-center">
                    <Text className="text-white font-bold text-xl">3</Text>
                  </View>
                </View>
                <Text className="text-white text-center mt-1 text-xs">Likes</Text>
              </>
            ) : (
              <>
                <View className="relative w-16 h-16">
                  <Image 
                    source={{ uri: match.imageUrl }} 
                    className="w-16 h-16 rounded-full"
                  />
                  {match.isVerified && (
                    <View className="absolute right-0 bottom-0 bg-blue-500 rounded-full p-1">
                      <MaterialCommunityIcons name="check-decagram" size={12} color="white" />
                    </View>
                  )}
                </View>
                <Text className="text-white text-center mt-1 text-xs">{match.name}</Text>
              </>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
} 