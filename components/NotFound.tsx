import React from "react";
import { Text, View } from "./Themed";
import { StyleProp, ViewStyle } from "react-native";
type Props = {
  message: string;
  style?: StyleProp<ViewStyle>;
};
const NotFound = ({ message, style }: Props) => {
  return (
    <View
      style={[
        { flex: 1, justifyContent: "center", alignItems: "center" },
        style,
      ]}
    >
      <Text>{message || "NotFound"}</Text>
    </View>
  );
};

export default NotFound;
