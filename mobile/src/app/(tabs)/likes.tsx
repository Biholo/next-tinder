import { View, Text, Image, TouchableOpacity, ImageBackground, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const { width } = Dimensions.get("window")
const CARD_GAP = 1 // 1px gap between cards
const CARD_WIDTH = (width - CARD_GAP) / 2 // 2 cards per row with 1px gap

export default function LikesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="px-4 pt-2">
        <Image
          source={{
            uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mJXBl7iepu0PcsBCV3p2hq90HAMcku.png",
          }}
          className="h-8 w-24 object-contain"
        />
      </View>

      {/* Title */}
      <View className="px-4 mt-6 mb-4">
        <Text className="text-white text-xl font-semibold">3 Likes</Text>
      </View>

      {/* Content */}
      <View className="flex-1">
        {/* Grid of Cards */}
        <View className="flex-row flex-wrap">
          {[
            {
              age: 20,
              description: "Long terme, OK p...",
              verified: true,
              image: "/placeholder.svg",
            },
            {
              age: 22,
              description: "Étudiante kinésith...",
              verified: false,
              image: "/placeholder.svg",
            },
            {
              age: 21,
              description: "Long terme, OK p...",
              verified: false,
              image: "/placeholder.svg",
            },
          ].map((profile, index) => (
            <View
              key={index}
              style={{
                width: CARD_WIDTH,
                marginLeft: index % 2 === 0 ? 0 : CARD_GAP,
                marginBottom: CARD_GAP,
              }}
              className="aspect-[4/5]"
            >
              <ImageBackground source={{ uri: profile.image }} className="w-full h-full" imageStyle={{ opacity: 0.5 }}>
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} className="absolute bottom-0 w-full p-2">
                  <View className="flex-row items-center">
                    <Text className="text-white text-lg font-semibold mr-1">{profile.age}</Text>
                    {profile.verified && <MaterialCommunityIcons name="check-decagram" size={20} color="#00bfff" />}
                  </View>
                  <Text className="text-white text-sm">{profile.description}</Text>
                </LinearGradient>
              </ImageBackground>
            </View>
          ))}
        </View>

      </View>
    </SafeAreaView>
  )
}

