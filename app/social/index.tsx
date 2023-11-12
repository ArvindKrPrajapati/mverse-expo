import { View, useColorScheme, Dimensions } from "react-native";
import React from "react";
import { Text } from "../../components/Themed";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Colors from "../../constants/Colors";
import AllPosts from "../../components/Social/AllPosts";
import FollowingPosts from "../../components/Social/FollowingPosts";
import { useRoute } from "@react-navigation/native";
const Tab = createMaterialTopTabNavigator();

const SocialHome = () => {
  const colorScheme = useColorScheme();
  const screenWidth = Dimensions.get("window").width;
  const route = useRoute();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].secondaryText,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].text,
        tabBarLabelStyle: { fontWeight: "bold", textTransform: "capitalize" },
        tabBarScrollEnabled: true,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          height: 45,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.dark.purple,
          width: 80,
          marginHorizontal: screenWidth / 7,
        },
        tabBarItemStyle: {
          width: screenWidth / 2,
        },
        tabBarAndroidRipple: {
          borderless: false,
        },
        swipeEnabled: true,
        animationEnabled: true,
      }}
    >
      <Tab.Screen name="For you" component={AllPosts} />
      <Tab.Screen name="Following" component={FollowingPosts} />
    </Tab.Navigator>
  );
};

export default SocialHome;
