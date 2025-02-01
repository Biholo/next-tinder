import { View, Text } from 'react-native';

type TagProps = {
  text: string;
  color?: string;
  textColor?: string;
};

export function Tag({ 
  text, 
  color = 'bg-zinc-800/80', 
  textColor = 'text-white' 
}: TagProps) {
  return (
    <View className={`${color} rounded-full px-3 py-1`}>
      <Text className={textColor}>{text}</Text>
    </View>
  );
} 