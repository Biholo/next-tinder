import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

export default function SignUpScreen() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (name: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSignUp = () => {
    // Logique d'inscription à implémenter
    console.log("Données du formulaire:", formData)
  }

  return (
    <LinearGradient colors={["#ec4899", "#f97316"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="flex-1">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerClassName="flex-grow justify-center p-4">
          <View className="bg-white rounded-xl shadow-xl p-8 space-y-6">
            <Text className="text-3xl font-bold text-center text-gray-800">Créer un compte</Text>

            <View className="space-y-4 mt-4">
              <View className="flex-row space-x-2 mb-4">
                <View className="flex-1 mr-1">
                  <TextInput
                    placeholder="Nom"
                    value={formData.lastName}
                    onChangeText={(text) => handleChange("lastName", text)}
                    className="px-4 py-3 rounded-full border border-gray-300"
                  />
                </View>
                <View className="flex-1 ml-1">
                  <TextInput
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChangeText={(text) => handleChange("firstName", text)}
                    className="px-4 py-3 rounded-full border border-gray-300"
                  />
                </View>
              </View>

              <TextInput
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                className="px-4 py-3 rounded-full border border-gray-300 mb-4"
              />

              <TextInput
                placeholder="Numéro de téléphone"
                value={formData.phone}
                onChangeText={(text) => handleChange("phone", text)}
                keyboardType="phone-pad"
                className="px-4 py-3 rounded-full border border-gray-300 mb-4"
              />

              <TextInput
                placeholder="Date de naissance"
                value={formData.dateOfBirth}
                onChangeText={(text) => handleChange("dateOfBirth", text)}
                className="px-4 py-3 rounded-full border border-gray-300 mb-4"
              />

              <TextInput
                placeholder="Genre"
                value={formData.gender}
                onChangeText={(text) => handleChange("gender", text)}
                className="px-4 py-3 rounded-full border border-gray-300 mb-4"
              />

              <TextInput
                placeholder="Mot de passe"
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
                className="px-4 py-3 rounded-full border border-gray-300 mb-4"
              />

              <TextInput
                placeholder="Confirmer le mot de passe"
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
                secureTextEntry
                className="px-4 py-3 rounded-full border border-gray-300 mb-4"
              />
            </View>

            <TouchableOpacity onPress={handleSignUp}>
              <LinearGradient
                colors={["#ec4899", "#f97316"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-3 rounded-full overflow-hidden"
              >
                <Text className="text-white font-bold text-center rounder">Créer un compte</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-gray-600 mr-1">Vous avez déjà un compte ?</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
                <Text className="text-pink-500 font-bold">Se connecter</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-center text-sm text-gray-600 mt-4">
              En créant un compte, vous acceptez nos <Text className="text-pink-500">Conditions d'utilisation</Text> et
              notre <Text className="text-pink-500">Politique de confidentialité</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

