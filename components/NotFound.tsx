import React from "react";
import { Text, View } from "./Themed";

const NotFound = ({message}:any) => {
  return (
    <View>
      <Text>{message || "NotFound"}</Text>
    </View>
  );
};

export default NotFound;
