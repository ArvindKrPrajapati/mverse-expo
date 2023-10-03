import React from "react";
import { useColorScheme } from "react-native";
import Colors from "../../constants/Colors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeTab from "../../components/Profile/HomeTab";
import VideosTab from "../../components/Profile/VideosTab";
import PlaylistTab from "../../components/Profile/PlaylistTab";
import AboutTab from "../../components/Profile/AboutTab";
const Tab = createMaterialTopTabNavigator();
const ProfileScreen = () => {
  const colorScheme = useColorScheme();

  return null
  // return (
  //   <Tab.Navigator
  //     screenOptions={{
  //       tabBarActiveTintColor: Colors[colorScheme ?? "light"].secondaryText,
  //       tabBarInactiveTintColor: Colors[colorScheme ?? "light"].text,
  //       tabBarLabelStyle: { fontWeight: "bold" },
  //       tabBarScrollEnabled: true,
  //       tabBarStyle: {
  //         backgroundColor: Colors[colorScheme ?? "light"].background,
  //       },
  //       tabBarIndicatorStyle: { backgroundColor: Colors.dark.purple },
  //       tabBarItemStyle: {
  //         width: 120,
  //       },
  //       tabBarAndroidRipple: {
  //         borderless: false,
  //       },
  //       swipeEnabled: true,
  //       animationEnabled: true,
  //     }}
  //   >
  //     <Tab.Screen name="About" component={AboutTab} />
  //     <Tab.Screen name="Home" component={HomeTab} />
  //     <Tab.Screen name="Videos" component={VideosTab} />
  //     <Tab.Screen name="Playlist" component={PlaylistTab} />
  //   </Tab.Navigator>
  // );
};

export default ProfileScreen;
