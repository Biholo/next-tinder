import { Tabs } from "expo-router"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { View } from "react-native"

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#666666',
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Pour toi",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="fire" size={28} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="explore" 
        options={{ 
          title: "Explorer",
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={24} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="favorites" 
        options={{ 
          title: "Favoris",
          tabBarIcon: ({ color }) => (
            <View className="relative">
              <Ionicons name="star-outline" size={24} color={color} />
              <View className="absolute -right-3 -top-2 bg-pink-500 rounded-full w-4 h-4 items-center justify-center">
                <Text className="text-white text-xs font-bold">4</Text>
              </View>
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="likes" 
        options={{ 
          title: "Likes",
          tabBarIcon: ({ color }) => (
            <View className="relative">
            <Ionicons name="heart-outline" size={24} color={color} />
            <View className="absolute -right-1 -top-1 bg-pink-500 rounded-full w-2 h-2" />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="chat" 
        options={{ 
          title: "Messages",
          tabBarIcon: ({ color }) => (
            <View className="relative">
              <Ionicons name="chatbubble-outline" size={24} color={color} />
              <View className="absolute -right-1 -top-1 bg-pink-500 rounded-full w-2 h-2" />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          )
        }} 
      />
    </Tabs>
  )
}
