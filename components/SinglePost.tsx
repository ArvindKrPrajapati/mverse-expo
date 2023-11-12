import { Pressable, View, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "./Themed";
import GenerateUserPicture from "./GenerateUserPicture";
import Colors from "../constants/Colors";
import {
  formatDate,
  formatFullDateTime,
  formatTime,
  handleNumbers,
} from "../utils/common";
import LogoButton from "./LogoButton";
import { Link, useNavigation, usePathname, useRouter } from "expo-router";
import { TouchableHighlight } from "react-native-gesture-handler";
import { TouchableRipple } from "react-native-paper";
import { mversePost } from "../service/api.service";
import ShowImages from "./Social/ShowImages";

type Props = {
  data: any;
  vertical?: boolean;
  showLine?: boolean;
};

const SinglePost = ({ data, vertical = false, showLine = true }: Props) => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const navigation = useNavigation();
  const [liking, setLiking] = useState(false);
  const [item, setItem] = useState(data);
  const border = {
    borderBottomWidth: 1,
    borderBottomColor: Colors[colorScheme ?? "dark"].lineColor,
  };
  useEffect(() => {
    setItem(data);
  }, [data]);

  const handleLikeSubmit = async (isLiked: boolean) => {
    if (liking) return;
    setItem((prev: any) => ({
      ...prev,
      iLiked: !prev.iLiked,
      likes: isLiked ? prev.likes - 1 : prev.likes + 1,
    }));
    try {
      setLiking(true);
      await mversePost("/api/posts/likes", { postId: item._id });
    } catch (error) {
      setItem(data);
    } finally {
      setLiking(false);
    }
  };
  const renderUserInfo = (
    <Text style={{ flexDirection: "row" }} numberOfLines={vertical ? 2 : 1}>
      <Text style={{ fontWeight: "500" }}>{item.user.name}</Text>
      {vertical ? " \n" : "  "}
      <Text style={{ color: Colors[colorScheme ?? "dark"].secondaryText }}>
        {item.user.username} {formatDate(item.createdAt, !vertical)}
      </Text>
    </Text>
  );

  return (
    <TouchableRipple
      rippleColor={
        colorScheme == "dark" ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.1)"
      }
      onPress={() => {
        if (!vertical) {
          // @ts-ignore
          navigation.push("social-post", { item });
        }
      }}
      style={[vertical ? border : {}, !showLine ? border : {}]}
    >
      <View
        style={{
          flexDirection: vertical ? "column" : "row",
          padding: 15,
          gap: 15,
        }}
      >
        <View style={{ flexDirection: "row", gap: vertical ? 15 : 0 }}>
          <Pressable
            onPress={() => {
              router.push(`/profile/${item.user.username}`);
            }}
            style={{ alignItems: "center" }}
          >
            <GenerateUserPicture user={item.user} size={40} />
            {/* line */}
            {showLine ? (
              <View
                style={{
                  width: 1.5,
                  flex: 1,
                  position: "absolute",
                  height: "140%",
                  backgroundColor: Colors[colorScheme ?? "dark"].lineColor,
                }}
              ></View>
            ) : null}
          </Pressable>
          {vertical ? renderUserInfo : null}
        </View>
        <View style={{ paddingVertical: 2, flex: 1 }}>
          {!vertical ? renderUserInfo : null}
          {/* content */}
          {item.text ? (
            <Text
              style={{
                marginTop: 1,
              }}
            >
              {item.text}
            </Text>
          ) : null}
          {/* images */}
          {item.images && item.images.length ? (
            <ShowImages clickable={true} images={item.images} />
          ) : null}
          {/* exact date time */}
          {vertical ? (
            <Text
              style={{
                color: Colors[colorScheme ?? "dark"].secondaryText,
                fontSize: 12,
                marginTop: 5,
              }}
            >
              {formatFullDateTime(item.createdAt)}
            </Text>
          ) : null}
          {/* action buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", gap: 10 }}>
              {/* like */}
              <LogoButton
                icon={item.iLiked ? "heart" : "heart-outline"}
                iconSize={15}
                style={{
                  backgroundColor: "transparent",
                  marginTop: 1,
                  marginLeft: -10,
                  gap: 3,
                }}
                onPress={() => {
                  handleLikeSubmit(item.iLiked);
                }}
                label={handleNumbers(item.likes)}
                textStyle={{ fontSize: 13 }}
                textColor={
                  item.iLiked
                    ? Colors.default.red
                    : Colors[colorScheme ?? "dark"].secondaryText
                }
              />

              <LogoButton
                icon="chat-outline"
                iconSize={15}
                style={{
                  backgroundColor: "transparent",
                  marginTop: 1,
                  marginLeft: -10,
                  gap: 3,
                }}
                onPress={(event: any) => {
                  // @ts-ignore
                  navigation.navigate("add-social", { item });
                  // router.push("/social/add");
                }}
                label={handleNumbers(item.comments)}
                textStyle={{ fontSize: 13 }}
                textColor={Colors[colorScheme ?? "dark"].secondaryText}
              />
              {/* <LogoButton
                icon="repeat-variant"
                iconSize={15}
                style={{
                  backgroundColor: "transparent",
                  marginTop: 1,
                  marginLeft: -10,
                  gap: 3,
                }}
                onPress={() => {
                  console.log("hii");
                }}
                label="100k"
                textStyle={{ fontSize: 13 }}
                textColor={Colors[colorScheme ?? "dark"].secondaryText}
              /> */}
            </View>
            <LogoButton
              icon="share-variant"
              iconSize={15}
              style={{
                backgroundColor: "transparent",
                marginTop: 1,
                marginLeft: -10,
                gap: 3,
              }}
              onPress={() => {
                console.log("share button");
              }}
              textColor={Colors[colorScheme ?? "dark"].secondaryText}
            />
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

export default SinglePost;
