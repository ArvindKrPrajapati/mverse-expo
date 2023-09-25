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

export default function Card({
  item,
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
    <TouchableHighlight onPress={() => alert("hiii")}>
      <View
        style={{
          marginBottom: horizontal ? 0 : 10,
          padding: horizontal ? 10 : 0,
          flexDirection: history || !horizontal ? "column" : "row",
        }}
      >
        {/* @ts-ignore */}
        <View style={[{ aspectRatio: 16 / 10 }, horizontalStyle]}>
          <Image
            source={{ uri: item?.thumbnail }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: horizontal ? 5 : 0,
            }}
            resizeMode="stretch"
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
              paddingVertical: history ? 5 : horizontal ? 0 : 12,
            },
            styleForHistory,
          ]}
        >
          {!horizontal ? (
            <View style={{ marginHorizontal: 5 }}>
              <Link href={`/profile/${item.by.username}`}>
                <TouchableHighlight>
                  <GenerateUserPicture size={35} user={item.by} />
                </TouchableHighlight>
              </Link>
            </View>
          ) : null}
          <View
            style={{
              paddingHorizontal: history ? 2 : 10,
              flex: history ? 0 : 1,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                marginBottom: 2,
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
                  {!horizontal ? item.by.channelName + "  " : null}
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
