import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons, Feather } from "@expo/vector-icons"
import { useState } from "react"
import { PhotoCarousel, ProfileSection } from "../../components"

export default function DetailsProfileScreen() {
  const router = useRouter()
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const photos = ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header with name and exit button */}
      <View className="px-4 py-2 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Text className="text-white text-4xl font-bold">Kilian, 22</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <PhotoCarousel
          photos={photos}
          currentPhotoIndex={currentPhotoIndex}
          onPhotoChange={setCurrentPhotoIndex}
        />
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

