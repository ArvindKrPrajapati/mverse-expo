import {
  View,
  ActivityIndicator,
  FlatList,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNotification } from "../../Providers/NotificationProvider";
import Colors from "../../constants/Colors";
import NotFound from "../../components/NotFound";
import { TouchableRipple } from "react-native-paper";
import GenerateUserPicture from "../../components/GenerateUserPicture";
import { Text } from "../../components/Themed";
import { useNavigation, useRouter } from "expo-router";
import ShowImages from "../../components/Social/ShowImages";
import { formatDate, formatTime } from "../../utils/common";
import { useIsFocused } from "@react-navigation/native";
import { mversePatch } from "../../service/api.service";

const NotificationPage = () => {
  const {
    data,
    loading,
    loadNotification,
    loadMoreLoading,
    skip,
    setData,
    limit,
    setRecieved,
    recieved,
  } = useNotification();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const handleSeen = async () => {
    await mversePatch("/api/posts/notification", {});
  };

  useEffect(() => {
    if (recieved) {
      setRecieved(false);
      setData(data.map((item: any) => ({ ...item, seen: true })));
      handleSeen();
    }
  }, [isFocused]);

  const renderItem = ({ item }: any) => {
    let mypost = item?.post?.belongsTo ? item?.post?.belongsToPost : item?.post;
    if (item.type == "LIKE") {
      mypost = item?.post;
    }
    return (
      <TouchableRipple
        onPress={() => {
          // @ts-ignore
          navigation.push("social-post", { item: item.post });
        }}
        rippleColor={
          colorScheme == "dark" ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.1)"
        }
      >
        <View style={{ flexDirection: "row", padding: 15, gap: 15 }}>
          <View style={{ alignItems: "center" }}>
            <TouchableRipple
              onPress={() => {
                router.push(`/profile/${item?.sender?.username}`);
              }}
              background={{
                foreground: true,
                color: "black",
              }}
              style={{ zIndex: 2 }}
            >
              <GenerateUserPicture user={item.sender} size={30} />
            </TouchableRipple>
            <View
              style={{
                width: item.seen ? 0 : 2,
                flex: 1,
                position: "absolute",
                height: "150%",
                backgroundColor: Colors[colorScheme ?? "dark"].lineColor,
              }}
            ></View>
          </View>
          {/* content */}
          <Text
            style={{
              flex: 1,
              fontWeight: "700",
            }}
          >
            {item.sender.name}{" "}
            <Text
              style={{
                fontSize: 12,
                color: Colors[colorScheme ?? "dark"].secondaryText,
              }}
            >
              {item.sender.username}
            </Text>{" "}
            {item.type == "LIKE"
              ? item.post?.belongsToPost?.belongsTo
                ? "liked your reply"
                : item.post.belongsTo
                ? "liked your comment"
                : "liked your post"
              : null}
            {item.type == "COMMENT"
              ? item.post.belongsToPost.belongsTo
                ? "replied to your comment"
                : "commented on your post"
              : null}
            {mypost.text ? (
              <Text numberOfLines={3} style={{ fontWeight: "400" }}>
                {"\n" + mypost.text}
              </Text>
            ) : null}
            <Text
              style={{
                fontSize: 11,
                color: Colors[colorScheme ?? "dark"].secondaryText,
                lineHeight: 18,
              }}
            >
              {"\n" + formatDate(item.createdAt)}
            </Text>
          </Text>
          {/* images if exist */}
          {mypost.images.length ? (
            <View style={{ width: "20%" }}>
              <ShowImages images={mypost.images} width="100%" square={true} />
            </View>
          ) : null}
        </View>
      </TouchableRipple>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotification(false);
    setRefreshing(false);
    await handleSeen();
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={50} color={Colors.default.purple} />
      </View>
    );
  }
  return (
    <FlatList
      ListEmptyComponent={<NotFound message="No notifications" />}
      showsVerticalScrollIndicator={false}
      style={{ paddingBottom: 0 }}
      contentContainerStyle={{
        paddingBottom: 20,
        flexGrow: 1,
        backgroundColor: Colors[colorScheme ?? "dark"].background,
      }}
      data={data}
      renderItem={renderItem}
      onEndReached={() => {
        loadNotification(true, skip + limit, limit);
      }}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        <>
          {loadMoreLoading ? (
            <ActivityIndicator
              size={40}
              color={Colors.dark.purple}
              style={{ marginBottom: 30, marginTop: 15 }}
            />
          ) : null}
        </>
      }
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

export default NotificationPage;
