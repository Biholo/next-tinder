import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useRouter } from "expo-router"
import { CustomInput, GradientBackground, GradientButton } from "../../components"
import { login } from "@/redux/slices/authSlice"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { loginSchema } from "@/validators/loginValidator"

export default function SignInScreen() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    try {
      const { error } = loginSchema.validate(formData, { abortEarly: false })
      if (error) {
        const validationErrors: Record<string, string> = {}
        error.details.forEach((detail) => {
          validationErrors[detail.path[0]] = detail.message
        })
        setErrors(validationErrors)
        return false
      }
      setErrors({})
      return true
    } catch (error) {
      console.error('Validation error:', error)
      return false
    }
  }

  const handleLogin = async () => {
    try {
      if (!validateForm()) return

      const response = await dispatch(login(formData)).unwrap()
      if (response) {
        router.replace("/(tabs)")
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Une erreur est survenue lors de la connexion' })
    }
  }

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const renderError = (field: string) => {
    return errors[field] ? (
      <Text className="text-red-500 text-xs ml-4 -mt-2">{errors[field]}</Text>
    ) : null
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerClassName="flex-grow justify-center p-4">
          <View className="bg-white rounded-xl shadow-xl p-8 space-y-4">
            <Text className="text-3xl font-bold text-center text-gray-800">Connexion</Text>

            <View className="space-y-2 mt-4">
              <CustomInput
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                error={errors.email}
              />
              {renderError('email')}

              <CustomInput
                placeholder="Mot de passe"
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
                error={errors.password}
              />
              {renderError('password')}
            </View>

            <GradientButton
              onPress={handleLogin}
              title="Se connecter"
            />

            {errors.submit && (
              <Text className="text-red-500 text-center text-sm">{errors.submit}</Text>
            )}

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

