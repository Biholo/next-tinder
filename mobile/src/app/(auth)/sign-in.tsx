import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useRouter } from "expo-router"
import { CustomInput, GradientBackground, GradientButton } from "../../components"

export default function SignInScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    // Logique de connexion (ex: Firebase, API...)
    router.replace("/(tabs)")
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerClassName="flex-grow justify-center p-4">
          <View className="bg-white rounded-xl shadow-xl p-8 space-y-6">
            <Text className="text-3xl font-bold text-center text-gray-800">Connexion</Text>

            <View className="space-y-4 mt-4">
              <CustomInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <CustomInput
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <GradientButton
              onPress={handleLogin}
              title="Se connecter"
            />

            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-gray-600 mr-1">Vous n'avez pas de compte ?</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
                <Text className="text-pink-500 font-bold">Créer un compte</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  )
}

