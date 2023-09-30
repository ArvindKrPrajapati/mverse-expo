import React from "react";
import { Text, View } from "../components/Themed";
import { useRoute } from "@react-navigation/native";
import MversePlayer from "../components/Player/MversePlayer";

const orientationEnum = [
  "UNKNOWN",
  "PORTRAIT_UP",
  "PORTRAIT_DOWN",
  "LANDSCAPE_LEFT",
  "LANDSCAPE_RIGHT",
];
const PlayPage = () => {
  const route = useRoute();
  // @ts-ignore
  const item = route.params.item || null;

  return (
    <View style={{ flex: 1 }}>
      <MversePlayer
        url={item.link}
        poster={item.thumbnail}
        title={item.title}
      />
    </View>
  );
};

export default PlayPage;
