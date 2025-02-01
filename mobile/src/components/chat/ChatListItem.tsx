import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

type ChatListItemProps = {
  name: string;
  message: string;
  status?: 'online' | 'offline';
  action?: string;
};

export function ChatListItem({ name, message, status, action }: ChatListItemProps) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      className="flex-row items-center mb-4"
      onPress={() => router.push("/stack/conversation")}
    >
      <View className="relative">
        <View className="w-14 h-14 rounded-full bg-zinc-800" />
        {status === 'online' && (
          <View className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
        )}
      </View>
      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-white font-semibold">{name}</Text>
          {action && (
            <View className="bg-zinc-800 rounded-full px-3 py-1">
              <Text className="text-white text-xs">{action}</Text>
            </View>
          )}
        </View>
        <Text className="text-gray-400 text-sm">{message}</Text>
      </View>
    </TouchableOpacity>
  );
} 