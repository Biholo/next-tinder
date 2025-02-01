import { useState, useEffect } from "react"
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, Switch, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Ionicons, Feather } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import * as ImagePicker from "expo-image-picker"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { updateUser, uploadUserPhoto, deleteUserPhoto } from "@/redux/slices/userSlice"
import { Header } from '@/components/layout/Header'

interface Photo {
  _id: string;
  photoUrl: string;
}

export default function EditProfileScreen() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  
  const [smartPhotos, setSmartPhotos] = useState(true)
  const [bio, setBio] = useState(user?.bio || "")
  const [age, setAge] = useState(user?.dateOfBirth || "")
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(user?.gender || "male")
  const [lookingFor, setLookingFor] = useState<'male' | 'female' | 'both'>(user?.preferences?.gender || "both")
  const [photos, setPhotos] = useState<Photo[]>(user?.photos || [])

  useEffect(() => {
    if (user) {
      setBio(user.bio || "")
      setGender(user.gender || "male")
      setLookingFor(user.preferences?.gender || "both")
      setAge(calculateAge(user.dateOfBirth || ""))
      setPhotos(user.photos || [])
    }
  }, [user])

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

  const handleDeletePhoto = (index: number) => {
    Alert.alert("Supprimer la photo", "Es-tu sûr(e) de vouloir supprimer cette photo ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            const photoToDelete = photos[index];
            if (photoToDelete?._id) {
              await dispatch(deleteUserPhoto(photoToDelete._id)).unwrap();
              const newPhotos = [...photos]
              newPhotos.splice(index, 1)
              setPhotos(newPhotos)
            }
          } catch (error) {
            console.error('Erreur lors de la suppression de la photo:', error)
            Alert.alert("Erreur", "Impossible de supprimer la photo")
          }
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

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled) {
        const formData = new FormData();
        formData.append('photo', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        } as any);

        const response = await dispatch(uploadUserPhoto(formData)).unwrap()
        if (response?.photo) {
          setPhotos(prev => [...prev, response.photo])
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo:', error)
      Alert.alert("Erreur", "Impossible d'ajouter la photo")
    }
  }

  const handleSave = async () => {
    try {
      await dispatch(updateUser({
        bio,
        gender,
        preferences: {
          gender: lookingFor,
          ageRange: user?.preferences?.ageRange || { min: 18, max: 50 }
        }
      })).unwrap()
      
      router.back()
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      Alert.alert("Erreur", "Impossible de mettre à jour le profil")
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <Header 
        showBackButton 
        title="Modifier mon profil"
        rightComponent={
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-[#FF4458] text-lg font-semibold">Terminé</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1">
        {/* Media Section */}
        <View className="p-4">
          <Text className="text-white text-xl mb-4">Média</Text>
          <View className="flex-row flex-wrap" style={{ gap: 4 }}>
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
                onValueChange={(itemValue) => setGender(itemValue as 'male' | 'female' | 'other')}
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
                onValueChange={(itemValue) => setLookingFor(itemValue as 'male' | 'female' | 'both')}
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

