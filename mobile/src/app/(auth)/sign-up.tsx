import { useAppDispatch } from "@/hooks/useAppDispatch"
import { register } from "@/redux/slices/authSlice"
import DatePicker from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { registerSchema } from "@/validators/registerValidator"
import DateTimePickerModal from "react-native-modal-datetime-picker"

export default function SignUpScreen() {
  const router = useRouter()
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    dateOfBirth: "2000-01-01",
    gender: "",
    password: "",
    confirmPassword: "",
  })
  const dispatch = useAppDispatch()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const validateForm = () => {
    try {
      const { error } = registerSchema.validate(formData, { abortEarly: false })
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

  const handleSignUp = async () => {
    try {
      if (!validateForm()) return

      const response = await dispatch(register(formData)).unwrap()
      if (response) {
        router.replace('/(tabs)/index')
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Une erreur est survenue' })
    }
  }

  const handleConfirmDate = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    handleChange('dateOfBirth', formattedDate);
    setShowDatePicker(false);
  };

  const hideDatePicker = () => {
    setShowDatePicker(false);
  };

  const renderError = (field: string) => {
    return errors[field] ? (
      <Text className="text-red-500 text-xs ml-4 -mt-2">{errors[field]}</Text>
    ) : null
  }

  const renderDatePicker = () => {
    return (
      <>
        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)}
          className={`px-4 py-3 rounded-full border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
        >
          <Text className={formData.dateOfBirth ? "text-black" : "text-gray-500"}>
            {formData.dateOfBirth || "Date de naissance"}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          maximumDate={new Date()}
          date={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date()}
        />
      </>
    );
  };

  return (
    <LinearGradient colors={["#ec4899", "#f97316"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="flex-1">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerClassName="flex-grow justify-center p-4">
          <View className="bg-white rounded-xl shadow-xl p-8 space-y-4">
            <Text className="text-3xl font-bold text-center text-gray-800">Créer un compte</Text>

            <View className="space-y-2 mt-4">
              <View className="flex-row space-x-2">
                <View className="flex-1">
                  <TextInput
                    placeholder="Nom"
                    value={formData.lastName}
                    onChangeText={(text) => handleChange("lastName", text)}
                    className={`px-4 py-3 rounded-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {renderError('lastName')}
                </View>

                <View className="flex-1">
                  <TextInput
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChangeText={(text) => handleChange("firstName", text)}
                    className={`px-4 py-3 rounded-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {renderError('firstName')}
                </View>
              </View>

              <TextInput
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                className={`px-4 py-3 rounded-full border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {renderError('email')}

              <TextInput
                placeholder="Numéro de téléphone"
                value={formData.phone}
                onChangeText={(text) => handleChange("phone", text)}
                keyboardType="phone-pad"
                className={`px-4 py-3 rounded-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {renderError('phone')}

              {renderDatePicker()}
              {renderError('dateOfBirth')}

              <View className={`border rounded-full mb-2 px-2 ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}>
                <Picker
                  selectedValue={formData.gender}
                  onValueChange={(value) => handleChange('gender', value)}
                  style={{ height: 50 }}
                >
                  <Picker.Item label="Sélectionnez votre genre" value="" />
                  <Picker.Item label="Homme" value="male" />
                  <Picker.Item label="Femme" value="female" />
                  <Picker.Item label="Autre" value="other" />
                </Picker>
              </View>
              {renderError('gender')}

              <TextInput
                placeholder="Mot de passe"
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
                className={`px-4 py-3 rounded-full border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {renderError('password')}

              <TextInput
                placeholder="Confirmer le mot de passe"
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
                secureTextEntry
                className={`px-4 py-3 rounded-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              {renderError('confirmPassword')}
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

            {errors.submit && (
              <Text className="text-red-500 text-center mt-2">{errors.submit}</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

