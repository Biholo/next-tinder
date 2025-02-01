import { useState, useRef, useCallback } from "react"
import { View, Text, Image, TouchableOpacity, Dimensions, FlatList, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import BottomSheet from "@gorhom/bottom-sheet"

const { width, height } = Dimensions.get("window")

export default function HomeScreen() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const bottomSheetRef = useRef<BottomSheet>(null)

  const photos = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Do89b41ZKVeQ62b9S92eJwTlMHW024.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4ZFudxwTpBNL3uyPyA2gp1mlp0W9Ir.png",
    "/placeholder.svg",
    "/placeholder.svg",
  ]

  const interests = ["Théâtre", "Voyage", "Expositions", "Jazz", "Musique"]

  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  const renderPhoto = ({ item, index }) => (
    <Image source={{ uri: item }} style={{ width, height: height * 0.6 }} resizeMode="cover" />
  )

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1">
        {/* Main content */}
        <View className="flex-1">
          {/* Photos Carousel */}
          <FlatList
            data={photos}
            renderItem={renderPhoto}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / width)
              setCurrentPhotoIndex(newIndex)
            }}
          />

          {/* Photo Progress Dots */}
          <View className="absolute top-4 w-full flex-row justify-center space-x-1">
            {photos.map((_, index) => (
              <View
                key={index}
                className={`h-1 rounded-full ${index === currentPhotoIndex ? "w-6 bg-white" : "w-6 bg-white/50"}`}
              />
            ))}
          </View>

          {/* New Member Badge */}
          <View className="absolute top-4 left-4 z-10">
            <View className="bg-black/50 rounded-lg px-2 py-1">
              <Text className="text-white text-sm">Nouvelle-au membre</Text>
            </View>
          </View>

          {/* Bottom Gradient and Content */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.9)"]}
            className="absolute bottom-0 w-full p-4 pt-20"
          >
            {/* User Info */}
            <View className="mb-4">
              <View className="flex-row items-center">
                <Text className="text-white text-3xl font-bold mr-2">Eva</Text>
                <Text className="text-white text-2xl">18</Text>
              </View>

              <View className="flex-row items-center mt-2">
                <Ionicons name="location" size={16} color="white" />
                <Text className="text-white ml-1">à 41 km</Text>
              </View>
            </View>

            {/* Interest Tags */}
            <View className="flex-row flex-wrap gap-2 mb-6">
              {interests.map((interest) => (
                <View key={interest} className="bg-zinc-800/80 rounded-full px-3 py-1">
                  <Text className="text-white">{interest}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-center items-center mb-4">
              <TouchableOpacity className="w-14 h-14 rounded-full bg-zinc-800 items-center justify-center">
                <Ionicons name="close" size={30} color="#FF4458" />
              </TouchableOpacity>

              <TouchableOpacity className="mx-4 w-14 h-14 rounded-full bg-zinc-800 items-center justify-center">
                <MaterialCommunityIcons name="star" size={30} color="#00bfff" />
              </TouchableOpacity>

              <TouchableOpacity className="w-14 h-14 rounded-full bg-zinc-800 items-center justify-center">
                <Ionicons name="heart" size={24} color="#4CD964" />
              </TouchableOpacity>

          
            </View>
          </LinearGradient>
        </View>

        {/* Bottom Sheet for Details */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={["50%", "90%"]}
          backgroundStyle={{ backgroundColor: "#121212" }}
          handleIndicatorStyle={{ backgroundColor: "#ffffff" }}
        >
          <ScrollView className="p-4">
            {/* Photos in BottomSheet */}
            <FlatList
              data={photos}
              renderItem={renderPhoto}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(e.nativeEvent.contentOffset.x / width)
                setCurrentPhotoIndex(newIndex)
              }}
            />

            {/* Photo Progress Dots */}
            <View className="w-full flex-row justify-center space-x-1 my-4">
              {photos.map((_, index) => (
                <View
                  key={index}
                  className={`h-1 rounded-full ${index === currentPhotoIndex ? "w-6 bg-white" : "w-6 bg-white/50"}`}
                />
              ))}
            </View>

            <View className="space-y-6">
              <View>
                <Text className="text-white text-xl font-bold mb-2">Je recherche</Text>
                <View className="bg-zinc-800 rounded-lg p-4">
                  <View className="flex-row items-center">
                    <Text className="text-yellow-500 text-4xl mr-2">🤔</Text>
                    <Text className="text-white text-lg">Je sais pas trop</Text>
                  </View>
                </View>
              </View>

              <View>
                <Text className="text-white text-xl font-bold mb-2">L'essentiel</Text>
                <View className="space-y-4">
                  <View className="flex-row items-center">
                    <Ionicons name="school-outline" size={24} color="white" className="mr-2" />
                    <Text className="text-white">Université de Paris</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="woman-outline" size={24} color="white" className="mr-2" />
                    <Text className="text-white">Femme</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </BottomSheet>
      </View>
    </SafeAreaView>
  )
}

