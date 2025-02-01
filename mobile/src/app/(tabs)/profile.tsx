import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useState } from "react"
import { PhotoCarousel, ProfileSection } from "../../components"

export default function ProfileScreen() {
  const router = useRouter()
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const photos = ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="px-4 pt-2 flex-row items-center justify-between">
        <Image
          source={{
            uri: "https://static.wikia.nocookie.net/logopedia/images/5/5f/Tinder_Icon_2017.svg/revision/latest?cb=20210110115759"
          }}
          className="h-8 w-24 object-contain"
        />
      </View>

      <ScrollView className="flex-1">
        <PhotoCarousel
          photos={photos}
          currentPhotoIndex={currentPhotoIndex}
          onPhotoChange={setCurrentPhotoIndex}
        />

        {/* Profile Info */}
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-3xl font-bold">Kilian, 22</Text>
              <View className="flex-row items-center mt-1">
                <MaterialCommunityIcons name="check-decagram" size={20} color="#00bfff" />
                <Text className="text-white ml-1">Profil vérifié</Text>
              </View>
            </View>
            <TouchableOpacity
              className="bg-[#FF4458] rounded-full px-4 py-2"
              onPress={() => router.push("/stack/edit-profile")}
            >
              <Text className="text-white font-semibold">Modifier</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-[#FF4458] self-start rounded-full mt-4 px-4 py-1">
            <Text className="text-white font-semibold">COMPLÉTÉ À 95 %</Text>
          </View>
        </View>


        {/* About Section */}
        <ProfileSection
          title="À propos de moi"
          about={[
            "Passionné par le cinéma (Inception meilleur film)",
            "Intelligence artificielle et Tech 🤓"
          ]}
        />

        {/* Sections */}
        <ProfileSection
          title="L'essentiel"
          items={[
            { icon: "location", text: "à moins d'un kilomètre" },
            { icon: "work", text: "Developeur" },
            { icon: "school", text: "Université Gustave Eiffel" }
          ]}
        />

        <ProfileSection
          title="Plus d'infos sur moi"
          items={[
            { icon: "school", text: "Master", subtitle: "Niveau d'études" },
            { icon: "message", text: "Texto", subtitle: "Communication" }
          ]}
        />

        <ProfileSection
          title="Mode de vie"
          items={[
            { icon: "cat", text: "Chat", subtitle: "Animal de compagnie" },
            { icon: "wine", text: "Non merci.", subtitle: "Alcool" },
            { icon: "smoking", text: "Non-fumeur·se", subtitle: "À quelle fréquence tu fumes ?" }
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

