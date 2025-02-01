import React from 'react';
import { View, Text } from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

interface ProfileItemProps {
  icon: JSX.Element;
  text: string;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, text }) => (
  <View className="flex-row items-center mt-2">
    {icon}
    <Text className="text-white text-lg ml-2">{text}</Text>
  </View>
);

interface ProfileSectionProps {
  title: string;
  items?: Array<{
    icon: keyof typeof ICONS;
    text: string;
    subtitle?: string;
  }>;
  about?: string[];
}

const ICONS = {
  location: (props: any) => <Ionicons name="location-outline" size={24} color="white" {...props} />,
  work: (props: any) => <MaterialIcons name="work-outline" size={24} color="white" {...props} />,
  school: (props: any) => <Ionicons name="school-outline" size={24} color="white" {...props} />,
  message: (props: any) => <MaterialCommunityIcons name="message-text-outline" size={24} color="white" {...props} />,
  cat: (props: any) => <MaterialCommunityIcons name="cat" size={24} color="white" {...props} />,
  wine: (props: any) => <MaterialCommunityIcons name="glass-wine" size={24} color="white" {...props} />,
  smoking: (props: any) => <MaterialCommunityIcons name="smoking-off" size={24} color="white" {...props} />,
  search: (props: any) => <Ionicons name="search" size={24} color="#666" {...props} />,
  eye: (props: any) => <Ionicons name="eye-outline" size={24} color="#666" {...props} />,
};

export const ProfileSection: React.FC<ProfileSectionProps> = ({ title, items, about }) => {
  return (
    <View className="mb-6 px-4">
      <Text className="text-zinc-400 text-lg mb-2">{title}</Text>
      
      {about && (
        <View className="space-y-2">
          {about.map((text, index) => (
            <Text key={index} className="text-white text-lg">{text}</Text>
          ))}
        </View>
      )}

      {items && (
        <View className="space-y-4">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.subtitle && (
                <Text className="text-zinc-400 text-lg mt-4">{item.subtitle}</Text>
              )}
              <ProfileItem
                icon={ICONS[item.icon]({})}
                text={item.text}
              />
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
};