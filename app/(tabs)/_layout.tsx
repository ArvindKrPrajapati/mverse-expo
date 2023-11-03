import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { Image, Pressable, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";
import { useAuth } from "../../Providers/AuthProvider";
import GenerateUserPicture from "../../components/GenerateUserPicture";
import Menu from "../../components/Menu";
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
    <MaterialCommunityIcons size={26} style={{ marginBottom: -8 }} {...props} />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, rawEmail } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          paddingBottom: 12,
          height: 63,
          paddingTop: 7,
          backgroundColor: Colors[colorScheme ?? "dark"].background,
        },
        headerTitleContainerStyle: { display: "none" },
        headerRightContainerStyle: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 3,
        },
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "dark"].background,
        },
        headerRight: () => (
          <>
            <Link href="/search-modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="search"
                    size={18}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 17, opacity: pressed ? 0.5 : 1 }}
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
                        size={23}
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
            {user ? <Menu /> : null}
          </>
        ),
        headerLeft: () => (
          <Image
            source={logo}
            style={{
              height: 60,
              resizeMode: "contain",
              width: 130,
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
