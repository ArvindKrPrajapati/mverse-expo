import React from "react";
import {
  Image,
  Pressable,
  useColorScheme,
  View,
  Dimensions,
} from "react-native";
import { Link } from "expo-router";
import { TouchableHighlight } from "react-native-gesture-handler";
import Colors from "../../constants/Colors";

const screenWidth = Dimensions.get("window").width;
export default function CardSkeleton({
  size = 4,
  history = false,
  horizontal = true,
}: any) {
  const colorScheme = useColorScheme();
  const styleForHistory = history
    ? {
        aspectRatio: 16 / 10,
      }
    : {};

  const horizontalStyle = horizontal ? { height: 90 } : { width: "100%" };
  return (
    <View style={{ flex: 1, flexDirection: history ? "row" : "column" }}>
      {Array.from(Array(size)).map((item, i) => (
        <View
          key={i}
          style={{
            marginBottom: horizontal ? 0 : 10,
            padding: horizontal ? 10 : 0,
            flexDirection: history || !horizontal ? "column" : "row",
          }}
        >
          <View
            style={[
              {
                aspectRatio: 16 / 10,
                backgroundColor: Colors[colorScheme ?? "light"].secondary,
                borderRadius: history ? 5 : 0,
              },
              //   @ts-ignore
              horizontalStyle,
            ]}
          ></View>
          {/* text */}
          <View
            style={{
              flexDirection: "row",
              paddingTop:10 ,
              padding: !history ? 10 : 0,
              gap: 10,
            }}
          >
            {!history ? (
              <View
                style={{
                  width: 35,
                  aspectRatio: 1 / 1,
                  borderRadius: 100,
                  backgroundColor: Colors[colorScheme ?? "light"].secondary,
                }}
              ></View>
            ) : null}
            <View style={{ justifyContent: "center", gap: 6 }}>
              <View
                style={{
                  height: 10,
                  backgroundColor: Colors[colorScheme ?? "light"].secondary,
                  width: history ? 142 : screenWidth - 60,
                }}
              ></View>
              <View
                style={{
                  height: 10,
                  backgroundColor: Colors[colorScheme ?? "light"].secondary,
                  width: history ? 142 : screenWidth - 60,
                }}
              ></View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
