import { View, Text, Image, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import { useState } from "react"
import { PhotoCarousel } from "@/components"
import { useAppSelector } from "@/hooks/useAppSelector"
import { Header } from '@/components/layout/Header'

interface ProfileSectionProps {
  title: string;
  items: Array<{
    icon: string;
    text: string;
  }>;
}

const ProfileSectionItem = ({ icon, text }: { icon: string; text: string }) => (
  <View className="flex-row items-center gap-3 py-2">
    <MaterialCommunityIcons name={icon as any} size={24} color="#666" />
    <Text className="text-gray-300">{text}</Text>
  </View>
);

const ProfileSection = ({ title, items }: ProfileSectionProps) => (
  <View className="mt-6">
    <Text className="text-lg font-medium text-white mb-2">{title}</Text>
    <View>
      {items.map((item, index) => (
        <ProfileSectionItem key={index} {...item} />
      ))}
    </View>
  </View>
);

export default function ProfileScreen() {
  const router = useRouter()
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAppSelector((state) => state.auth)

  console.log(user)
  if (!user) {
    return null;
  }

  // Calcul de l'âge
  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = user.dateOfBirth ? calculateAge(user.dateOfBirth) : null;

  // Calcul du pourcentage de complétion du profil
  const calculateProfileCompletion = () => {
    const fields = [
      user.firstName,
      user.photos?.length > 0,
      user.bio,
      user.preferences?.gender,
      user.preferences?.ageRange,
      user.dateOfBirth,
    ];
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const completionPercentage = calculateProfileCompletion();
  const photos = user.photos?.map((photo: any) => photo.photoUrl) || [];

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <Header showSettingsButton />

      <ScrollView className="flex-1">
        {/* Photos Carousel */}
        <PhotoCarousel
          photos={photos}
          currentPhotoIndex={currentPhotoIndex}
          onPhotoChange={setCurrentPhotoIndex}
        />

        {/* Profile Info */}
        <View className="px-4 py-4 -mt-20 rounded-t-3xl bg-zinc-950">
          {/* Search Bar */}
          <View className="relative flex-row items-center bg-zinc-900 rounded-full mb-6">
            <Feather name="search" size={20} color="#666" style={{ marginLeft: 12 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Je recherche"
              placeholderTextColor="#666"
              className="flex-1 pl-2 pr-4 py-2 text-white"
            />
          </View>

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-3xl font-bold">
                {user.firstName}{age ? `, ${age}` : ''}
              </Text>
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

          {/* Relationship Intent */}
          <View className="bg-pink-50/10 rounded-lg p-3 mt-4">
            <Text className="text-white">😊 Long terme, OK pour court</Text>
          </View>

          {/* Bio Section */}
          <View className="mt-6">
            <Text className="text-lg font-medium text-white mb-2">Bio Tinder</Text>
            <Text className="text-gray-300">{user.bio || "Aucune bio"}</Text>
          </View>

          {/* Essential Info */}
          <ProfileSection
            title="L'essentiel"
            items={[
              { icon: "map-marker", text: "à moins d'un kilomètre" },
              { icon: "briefcase", text: "Developeur" },
              { icon: "school", text: "Université Gustave Eiffel" }
            ]}
          />

          {/* Preferences Section */}
          <View className="mt-6">
            <Text className="text-lg font-medium text-white mb-2">Préférences</Text>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <Text className="text-white font-medium">Genre préféré : </Text>
                <Text className="text-gray-300 capitalize">
                  {user.preferences?.gender === 'male' ? 'Homme' : 
                   user.preferences?.gender === 'female' ? 'Femme' : 'Tout'}
                </Text>
              </View>
              {user.preferences?.ageRange && (
                <View className="flex-row items-center">
                  <Text className="text-white font-medium">Tranche d'âge : </Text>
                  <Text className="text-gray-300">
                    {user.preferences.ageRange.min} - {user.preferences.ageRange.max} ans
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Completion Status */}
          <View className="bg-[#FF4458] self-start rounded-full mt-6 px-4 py-1 mb-6">
            <Text className="text-white font-semibold">
              COMPLÉTÉ À {completionPercentage}%
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

