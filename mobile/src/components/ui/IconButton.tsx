import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IconButtonProps = {
  name: keyof typeof Ionicons.glyphMap;
  color?: string;
  size?: number;
  onPress?: () => void;
};

export function IconButton({ name, color = 'white', size = 24, onPress }: IconButtonProps) {
  return (
    <TouchableOpacity 
      className="w-14 h-14 rounded-full bg-zinc-800 items-center justify-center"
      onPress={onPress}
    >
      <Ionicons name={name} size={size} color={color} />
    </TouchableOpacity>
  );
} 