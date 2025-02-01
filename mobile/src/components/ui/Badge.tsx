import { View, Text } from 'react-native';

type BadgeProps = {
  count?: number;
  color?: string;
  size?: 'sm' | 'md';
};

export function Badge({ count, color = 'bg-pink-500', size = 'sm' }: BadgeProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-4 h-4'
  };

  return (
    <View className={`absolute -right-1 -top-1 ${color} rounded-full ${sizeClasses[size]} items-center justify-center`}>
      {count && (
        <Text className="text-white text-xs font-bold">{count}</Text>
      )}
    </View>
  );
} 