import { useState } from "react"
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, Switch, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons, Feather } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import * as ImagePicker from "expo-image-picker"

export default function EditProfileScreen() {
  const router = useRouter()
  const [smartPhotos, setSmartPhotos] = useState(true)
  const [bio, setBio] = useState(
    "Passionné par le cinéma (Inception meilleur film)\nIntelligence artificielle et Tech 🤓",
  )
  const [age, setAge] = useState("22")
  const [gender, setGender] = useState("Homme")
  const [lookingFor, setLookingFor] = useState("Les deux")

  const [photos, setPhotos] = useState([
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ])

  const handleDeletePhoto = (index: number) => {
    Alert.alert("Supprimer la photo", "Es-tu sûr(e) de vouloir supprimer cette photo ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          const newPhotos = [...photos]
          newPhotos.splice(index, 1)
          setPhotos(newPhotos)
        },
      },
    ])
  }

  const handleAddPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission refusée",
        "Vous devez accorder la permission d'accéder à votre galerie pour ajouter des photos.",
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri])
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2 border-b border-zinc-800">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="chevron-back" size={28} color="#FF4458" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-semibold">Modifier mon profil</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-[#FF4458] text-lg font-semibold">Terminé</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Media Section */}
        <View className="p-4">
          <Text className="text-white text-xl mb-4">Média</Text>
          <View className="flex-row flex-wrap" style={{ gap: 4 }}>
            {/* Existing Photos */}
            {photos.map((photo, index) => (
              <View key={index} className="relative" style={{ width: "32%", aspectRatio: 1 }}>
                <Image source={{ uri: photo }} className="w-full h-full rounded-lg" />
                <TouchableOpacity
                  onPress={() => handleDeletePhoto(index)}
                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
                >
                  <Feather name="x" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Photo Button */}
            {photos.length < 9 && (
              <TouchableOpacity
                onPress={handleAddPhoto}
                style={{ width: "32%", aspectRatio: 1 }}
                className="bg-zinc-800/40 rounded-lg border-2 border-dashed border-zinc-700 items-center justify-center"
              >
                <View className="bg-[#FF4458] rounded-full p-2">
                  <Feather name="plus" size={24} color="white" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Basic Info */}
        <View className="px-4 py-2">
          <Text className="text-white text-xl mb-4">Informations de base</Text>

          {/* Age Input */}
          <View className="bg-zinc-900 rounded-lg mb-4">
            <View className="p-4 border-b border-zinc-800">
              <Text className="text-zinc-400 text-sm mb-1">Âge</Text>
              <TextInput value={age} onChangeText={setAge} className="text-white text-lg" keyboardType="number-pad" />
            </View>

            {/* Gender Selection */}
            <View className="p-4 border-b border-zinc-800">
              <Text className="text-zinc-400 text-sm mb-1">Genre</Text>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={{ color: "white" }}
                dropdownIconColor="white"
              >
                <Picker.Item label="Homme" value="Homme" />
                <Picker.Item label="Femme" value="Femme" />
                <Picker.Item label="Autre" value="Autre" />
              </Picker>
            </View>

            {/* Looking For */}
            <View className="p-4">
              <Text className="text-zinc-400 text-sm mb-1">Je recherche</Text>
              <Picker
                selectedValue={lookingFor}
                onValueChange={(itemValue) => setLookingFor(itemValue)}
                style={{ color: "white" }}
                dropdownIconColor="white"
              >
                <Picker.Item label="Homme" value="Homme" />
                <Picker.Item label="Femme" value="Femme" />
                <Picker.Item label="Les deux" value="Les deux" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Options photo */}
        <View className="px-4 py-2">
          <Text className="text-white text-xl mb-4">Options photo</Text>
          <View className="flex-row items-center justify-between bg-zinc-900 p-4 rounded-lg">
            <View>
              <Text className="text-white text-lg">Smart Photos</Text>
              <Text className="text-zinc-400 text-sm mt-1">
                Smart Photos voste touvos vos photos en permanence pour trouver la meilleure.
              </Text>
            </View>
            <Switch
              value={smartPhotos}
              onValueChange={setSmartPhotos}
              trackColor={{ false: "#3f3f3f", true: "#FF4458" }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* À propos de moi */}
        <View className="px-4 py-2">
          <Text className="text-white text-xl mb-4">À propos de moi</Text>
          <View className="bg-zinc-900 rounded-lg p-4">
            <TextInput
              value={bio}
              onChangeText={setBio}
              multiline
              className="text-white text-lg"
              placeholder="Parle de toi..."
              placeholderTextColor="#666"
            />
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  )
}

