import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text, View } from "./Themed";
import Colors from "../constants/Colors";
import { ScrollView, useColorScheme } from "react-native";

const Tab = createMaterialTopTabNavigator();

function HomeTab() {
  return <Text>Tab 1 Content</Text>;
}

function VideosTab() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Tab 2 Content</Text>
    </View>
  );
}

function PlaylistTab() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Tab 3 Content</Text>
    </View>
  );
}
function BlogsTab() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Tab 3 Content</Text>
    </View>
  );
}
function AboutTab() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Tab 3 Content</Text>
    </View>
  );
}

function ProfileTabs() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].secondaryText,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].text,
        tabBarLabelStyle: { fontWeight: "bold" },
        tabBarScrollEnabled: true,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        tabBarIndicatorStyle: { backgroundColor: Colors.dark.purple },
        tabBarItemStyle: {
          width: 120,
        },
        tabBarAndroidRipple: {
          borderless: false,
        },
        swipeEnabled: true,
        animationEnabled: true,
      }}
    >
      <Tab.Screen name="Home" component={HomeTab} />
      <Tab.Screen name="Videos" component={VideosTab} />
      <Tab.Screen name="Playlist" component={PlaylistTab} />
      <Tab.Screen name="Blogs" component={BlogsTab} />
      <Tab.Screen name="About" component={AboutTab} />
    </Tab.Navigator>
  );
}

export default ProfileTabs;
