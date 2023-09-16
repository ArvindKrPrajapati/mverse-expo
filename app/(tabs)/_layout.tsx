import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { Image, Pressable, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";
import { useAuth } from "../../Providers/AuthProvider";
import GenerateUserPicture from "../../components/GenerateUserPicture";
const darkLogo = require("../../assets/images/darkLogo.png");
const logo = require("../../assets/images/logo.png");
/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
}) {
  return (
    <MaterialCommunityIcons size={24} style={{ marginBottom: -7 }} {...props} />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, rawEmail } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: { paddingBottom: 7, height: 55 },
        headerTitleContainerStyle: { display: "none" },
        headerRightContainerStyle: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 3,
        },
        headerRight: () => (
          <>
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="search"
                    size={20}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
            {user ? (
              <>
                <Link
                  href={
                    user.username
                      ? `/profile/${user.username}`
                      : "/create-channel"
                  }
                  asChild
                >
                  <Pressable>
                    {({ pressed }) => (
                      <GenerateUserPicture
                        user={user}
                        size={25}
                        style={{
                          marginRight: 15,
                          opacity: pressed ? 0.5 : 1,
                        }}
                      />
                    )}
                  </Pressable>
                </Link>
              </>
            ) : (
              <>
                <Link href={rawEmail ? "/verify-otp" : "/login"} asChild>
                  <Pressable>
                    {({ pressed }) => (
                      <MaterialCommunityIcons
                        name="account-circle"
                        size={25}
                        color={Colors[colorScheme ?? "light"].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                </Link>
              </>
            )}
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          </>
        ),
        headerLeft: () => (
          <Image
            source={colorScheme == "dark" ? darkLogo : logo}
            style={{
              height: 50,
              resizeMode: "contain",
              width: colorScheme == "dark" ? 100 : 120,
              marginLeft: 10,
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="blogs"
        options={{
          title: "Blogs",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="newspaper-variant-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="filmstrip-box-multiple" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
