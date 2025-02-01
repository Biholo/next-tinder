import "../global.css";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import store from "@/redux/store";
import { Provider } from "react-redux";


export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(auth)/sign-up");
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="stack" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
