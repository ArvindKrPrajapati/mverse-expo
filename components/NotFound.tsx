import React from "react";
import { Text, View } from "./Themed";

const NotFound = ({message}:any) => {
  return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
      <Text>{message || "NotFound"}</Text>
    </View>
  );
};

export default NotFound;
