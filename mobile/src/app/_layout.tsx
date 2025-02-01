import "../global.css";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import store from "@/redux/store";
import { Provider } from "react-redux";
import { wsService } from "@/services/websocketService"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { autoLogin } from "@/redux/slices/authSlice"
import { Loader } from "@/components"

function RootLayoutNav() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const wsConnected = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(autoLogin());
        setIsReady(true);
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        setIsReady(true);
      }
    };
    initAuth();
  }, [dispatch]);

  useEffect(() => {
    if (isReady && !loading && !isAuthenticated) {
      router.replace("/(auth)/sign-up");
    }
  }, [isReady, loading, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !wsConnected.current) {
      wsConnected.current = true;
      wsService.connect();

      return () => {
        wsConnected.current = false;
        wsService.disconnect();
      };
    }
  }, [isAuthenticated]);

  if (loading || !isReady) {
    return <Loader />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="stack" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <RootLayoutNav />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
