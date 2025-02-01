import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="conversation" options={{ title: "Conversations" }} />
      <Stack.Screen name="details-profile" options={{ title: "Détails du Profil" }} />
      <Stack.Screen name="edit-profile" options={{ title: "Modifier le Profil" }} />
    </Stack>
  );
}
