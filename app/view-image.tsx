import { View, Image } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text } from "../components/Themed";
import { useRoute } from "@react-navigation/native";
import LogoButton from "../components/LogoButton";

const ViewImage = () => {
  const route = useRoute();
  // @ts-ignore
  const item = route.params.item || null;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar backgroundColor="black" style="light" />

      <Image
        source={{ uri: item }}
        style={{ width: "100%", height: "60%" }}
        resizeMode="contain"
      />
    </View>
  );
};

export default ViewImage;
