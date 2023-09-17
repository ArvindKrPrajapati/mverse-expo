import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { AuthProvider } from "../Providers/AuthProvider";
import { SnackbarProvider } from "../Providers/SnackbarProvider";
import { Text } from "../components/Themed";
import Menu from "../components/Menu";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <SnackbarProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="login"
              options={{
                presentation: "modal",
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="signup"
              options={{
                presentation: "modal",
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="verify-otp"
              options={{
                presentation: "modal",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="create-channel"
              options={{
                presentation: "modal",
                headerTitle: "Create Channel",
                animation: "slide_from_right",
                headerRight: () => <Menu style={{ marginRight: 0 }} />,
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                headerTitle: "Settings",
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="profile/[username]"
              //@ts-ignore
              options={({ route }: any) => ({
                title: route?.params?.username || "Profile",
                headerShown: true,
                animation: "slide_from_right",
                headerRight: () => <Menu style={{ marginRight: 0 }} />,
              })}
            />
          </Stack>
        </ThemeProvider>
      </SnackbarProvider>
    </AuthProvider>
  );
}
