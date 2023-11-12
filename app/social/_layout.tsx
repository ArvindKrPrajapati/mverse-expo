import { View, Text, useColorScheme, Pressable, Image } from "react-native";
import React from "react";
import { Link, Tabs } from "expo-router";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useAuth } from "../../Providers/AuthProvider";
import GenerateUserPicture from "../../components/GenerateUserPicture";
const logo = require("../../assets/images/logo.png");

function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
}) {
  return (
    <MaterialCommunityIcons size={26} style={{ marginBottom: -8 }} {...props} />
  );
}

const SocialLayout = () => {
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
          borderTopColor: Colors[colorScheme ?? "dark"].secondary,
        },
        headerShadowVisible: false,
        headerTitleContainerStyle: { display: "none" },
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "dark"].background,
        },
        headerRight: () => (
          <>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={logo}
                style={{
                  height: 60,
                  resizeMode: "contain",
                  width: 130,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: 108,
                justifyContent: "flex-end",
              }}
            >
              <Link href="/search-modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="search"
                      size={18}
                      color={Colors[colorScheme ?? "light"].text}
                      style={{ marginRight: 20, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            </View>
          </>
        ),
        headerLeft: () => (
          <Link href={`/profile/${user?.username}`} asChild>
            <Pressable>
              {({ pressed }) => (
                <GenerateUserPicture
                  user={user}
                  size={26}
                  style={{
                    opacity: pressed ? 0.5 : 1,
                  }}
                />
              )}
            </Pressable>
          </Link>
        ),
        headerLeftContainerStyle: {
          width: 105,
          paddingLeft: 20,
        },
        headerRightContainerStyle: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
        },
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
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="pen-plus" color={color} />
          ),
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
        initialParams={{ item: null }}
      />
    </Tabs>
  );
};

export default SocialLayout;
