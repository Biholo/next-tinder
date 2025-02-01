import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (text: string) => void;
};

export function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  return (
    <View className="px-4 py-2">
      <View className="flex-row items-center bg-zinc-900 rounded-full px-4 py-2">
        <Ionicons name="search" size={20} color="#666" />
        <TextInput 
          placeholder={placeholder}
          placeholderTextColor="#666"
          className="ml-2 text-white flex-1"
          onChangeText={onSearch}
        />
      </View>
    </View>
  );
} 