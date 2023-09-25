import React from "react";
import { Image, Pressable, useColorScheme } from "react-native";
// import { formatDate, formatTime, handleViews } from "../lib/common";
import GenerateUserPicture from "./GenerateUserPicture";
import { Text, View } from "./Themed";
import { Link } from "expo-router";
import { formatDate, formatTime, handleNumbers } from "../utils/common";
import Colors from "../constants/Colors";
import VideoMenu from "./VideoMenu";
import { TouchableHighlight } from "react-native-gesture-handler";

export default function Card({ item, history = false }: any) {
  const colorScheme = useColorScheme();
  const styleForHistory = history
    ? {
        aspectRatio: 16 / 10,
      }
    : {};
  return (
    <TouchableHighlight onPress={() => alert("hiii")}>
      <View
        style={{
          padding: 10,
          flexDirection: history ? "column" : "row",
        }}
      >
        <View style={{ height: 90, aspectRatio: 16 / 10 }}>
          <Image
            source={{ uri: item?.thumbnail }}
            style={{ width: "100%", height: "100%", borderRadius: 5 }}
            resizeMode="cover"
          />
          <Text
            style={{
              backgroundColor: "black",
              color: "white",
              fontSize: 12,
              borderRadius: 2,
              paddingHorizontal: 4,
              position: "absolute",
              right: 6,
              bottom: 6,
            }}
          >
            {formatTime(item?.duration)}
          </Text>
        </View>
        <View
          style={[
            {
              flexDirection: "row",
              flex: history ? 0 : 1,
              paddingVertical: history ? 5 : 0,
            },
            styleForHistory,
          ]}
        >
          <View
            style={{
              paddingHorizontal: history ? 2 : 10,
              flex: history ? 0 : 1,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                marginBottom: 4,
                flexWrap: "wrap",
                lineHeight: 19,
              }}
              numberOfLines={2}
            >
              {item?.title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: Colors[colorScheme ?? "light"].secondaryText,
              }}
            >
              {history ? (
                <>{item.by.channelName}</>
              ) : (
                <>
                  {handleNumbers(item?.views || 0)} views{"  "}
                  {formatDate(item?.createdAt)}
                </>
              )}
            </Text>
          </View>
          <VideoMenu _id={item._id.toString()} />
        </View>
      </View>
    </TouchableHighlight>
  );
}
