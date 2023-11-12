import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  LogBox,
  Pressable,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { AuthProvider } from "../Providers/AuthProvider";
import { SnackbarProvider } from "../Providers/SnackbarProvider";
import { Text } from "../components/Themed";
import Menu from "../components/Menu";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { StatusBar } from "expo-status-bar";
import { SwiperModalProvider } from "../Providers/SwiperModalProvider";

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
  LogBox.ignoreAllLogs();
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
  const router = useRouter();

  return (
    <AuthProvider>
      <SnackbarProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <SwiperModalProvider>
            <StatusBar
              backgroundColor={Colors[colorScheme ?? "dark"].background}
            />
            <Stack
              screenOptions={{
                animation: "slide_from_right",
                headerStyle: {
                  backgroundColor: Colors[colorScheme ?? "dark"].background,
                },
              }}
            >
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
                name="search-modal"
                options={{
                  presentation: "modal",
                  headerShown: false,
                  headerTitle: "search",
                  animation: "slide_from_bottom",
                }}
              />
              <Stack.Screen
                name="play"
                options={{
                  headerShown: false,
                  animation: "slide_from_bottom",
                }}
              />
              <Stack.Screen
                name="error"
                options={{
                  headerTitle: "Error",
                  animation: "slide_from_bottom",
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
                name="social-post"
                options={{
                  headerTitle: "Post",
                  animation: "slide_from_right",
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="profile/[username]"
                //@ts-ignore
                options={({ route }: any) => ({
                  title: route?.params?.username || "Profile",
                  headerShown: true,
                  animation: "slide_from_right",
                  headerShadowVisible: false,
                  headerRight: () => <Menu style={{ marginRight: 0 }} />,
                })}
              />
              <Stack.Screen
                name="search-page"
                //@ts-ignore
                options={({ route, navigation }: any) => ({
                  title: "",
                  headerShown: true,
                  animation: "slide_from_right",
                  headerLeft: () => (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        gap: 15,
                        alignItems: "center",
                      }}
                    >
                      <Pressable onPress={() => router.back()}>
                        <MaterialCommunityIcons
                          name="arrow-left"
                          size={20}
                          color={Colors[colorScheme ?? "light"].text}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          router.push(
                            `/search-modal?search=${route.params.search}`
                          )
                        }
                        style={{
                          backgroundColor:
                            colorScheme == "light" ? "#eee" : "#0D141D",
                          padding: 8,
                          paddingHorizontal: 15,
                          borderRadius: 50,
                          width: "70%",
                        }}
                      >
                        <Text numberOfLines={1}>
                          {route.params.search || ""}
                        </Text>
                      </Pressable>
                    </View>
                  ),
                  headerRight: () => <Menu style={{ marginRight: 0 }} />,
                })}
              />
              <Stack.Screen
                name="playlist/[playlist]"
                //@ts-ignore
                options={({ route }: any) => ({
                  title:
                    route?.params?.playlist.replace("-", " ") || "Playlist",
                  headerShown: true,
                  headerRight: () => <Menu style={{ marginRight: 0 }} />,
                })}
              />
              <Stack.Screen
                name="private-playlist"
                //@ts-ignore
                options={({ route }: any) => ({
                  title: "Private Playlist",
                  headerShown: true,
                  headerRight: () => <Menu style={{ marginRight: 0 }} />,
                })}
              />
              <Stack.Screen
                name="social"
                options={{ headerShown: false, animation: "slide_from_left" }}
              />
              <Stack.Screen
                name="add-social"
                options={{ headerShown: false, animation: "none" }}
              />
            </Stack>
          </SwiperModalProvider>
        </ThemeProvider>
      </SnackbarProvider>
    </AuthProvider>
  );
}
