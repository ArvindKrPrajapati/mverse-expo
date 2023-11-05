import React, { useEffect, useState } from "react";
import { Text, View } from "../components/Themed";
import { useRoute } from "@react-navigation/native";
import MversePlayer from "../components/Player/MversePlayer";
import {
  ActivityIndicator,
  FlatList,
  useColorScheme,
  Dimensions,
} from "react-native";
import Card from "../components/Card";
import Colors from "../constants/Colors";
import LogoButton from "../components/LogoButton";
import { formatDate, handleNumbers } from "../utils/common";
import GenerateUserPicture from "../components/GenerateUserPicture";
import { useSnackbar } from "../Providers/SnackbarProvider";
import { mverseGet, mversePatch } from "../service/api.service";
import CardSkeleton from "../components/SkeletonLoader/CardSkeleton";
import { useAuth } from "../Providers/AuthProvider";
import { Link, useRouter } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import ActionButtons from "../components/ActionButtons";
import Input from "../components/Input";
import CommentContainer from "../components/CommentContainer";

const orientationEnum = [
  "UNKNOWN",
  "PORTRAIT_UP",
  "PORTRAIT_DOWN",
  "LANDSCAPE_LEFT",
  "LANDSCAPE_RIGHT",
];
const limit = 10;

const MyPlayerPlayPage = (props: any) => {
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  // @ts-ignore
  const i = props.item || null;
  const [item, setItem] = useState(i);
  const [videoLoading, setVideoLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const getVideo = async () => {
    try {
      const res = await mverseGet("/api/video/" + i._id);
      if (res.success) {
        setItem(res.data);
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
      setVideoLoading(false);
    }
  };
  useEffect(() => {
    getVideo();
  }, []);
  const colorScheme = useColorScheme();

  const [skip, setSkip] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [end, setEnd] = useState(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const [userData, setUserData] = useState({});
  const [userLoading, setUserLoading] = useState(true);

  const getUserData = async () => {
    try {
      const res = await mverseGet("/api/user/channel/" + i.by.username);
      if (res.success) {
        setUserData(res.data);
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
      setUserLoading(false);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  const _init = async (showLoader: boolean = false) => {
    try {
      setLoading(showLoader);
      setLoadMoreLoading(true);

      const res = await mverseGet(
        "/api/user/channel/" +
          item.by.username +
          "/videos?limit=" +
          limit +
          "&skip=" +
          skip
      );
      if (res.success) {
        res.data.length ? setData([...data, ...res.data]) : setEnd(true);
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  useEffect(() => {
    skip == 0 ? _init(true) : _init();
  }, [skip]);

  const loadMore = () => {
    if (loading || loadMoreLoading) return;
    !end ? setSkip((prev) => prev + limit) : null;
  };

  const renderItem = ({ item: obj, index }: any) => {
    return obj == 1 ? (
      <>
        <ChannelDescription
          username={i.by.username}
          userLoading={userLoading}
          data={userData}
        />
        {loading ? <CardSkeleton horizontal={false} size={3} /> : null}
      </>
    ) : (
      <Card item={obj} horizontal={false} replace={true} />
    );
  };

  if (!props.isVisible) {
    return null;
  }

  return (
    <>
      {/* comment modal */}
      <CommentContainer
        isCommentModalVisible={isCommentModalVisible}
        videoId={i._id}
        setIsCommentModalVisible={setIsCommentModalVisible}
      />
      {/* end */}
      <Modal
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight}
        isVisible={isVisible}
        animationIn="slideInUp"
        hasBackdrop={false}
        onBackButtonPress={() => setIsVisible(false)}
        coverScreen={false}
        useNativeDriver={true}
        style={{ margin: 0, justifyContent: "flex-end" }}
      >
        <View
          style={{
            width: "100%",
            aspectRatio: 11 / 17,
            backgroundColor: Colors[colorScheme ?? "light"].background,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: Colors[colorScheme ?? "light"].background,
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontWeight: "700" }}>Description</Text>
            <LogoButton
              icon="close"
              onPress={() => setIsVisible(false)}
              style={{ backgroundColor: "transparent" }}
            />
          </View>

          <Text style={{ padding: 15 }}>{item.description}</Text>
        </View>
      </Modal>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ paddingBottom: 20 }}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[1]}
        ListHeaderComponent={
          <View style={{ padding: 10 }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "100",
                fontFamily: "sans-serif",
              }}
            >
              {item.title}
            </Text>
            <Text style={{ fontSize: 13 }}>
              {handleNumbers(item.views)} views {formatDate(item.createdAt)}
            </Text>
            <LogoButton
              onPress={() => {
                setIsVisible(true);
              }}
              icon="chevron-down"
              numberOfLines={2}
              label={item.description}
              style={{
                flexDirection: "row-reverse",
                backgroundColor: "transparent",
                padding: 0,
              }}
              textColor={Colors[colorScheme ?? "light"].secondaryText}
              textStyle={{
                flex: 1,
                fontSize: 13,
              }}
            />
            <ActionButtons
              videoId={item._id}
              likes={item.likes}
              dislikes={item.dislikes}
              reaction={item.raection}
              comments={item.comments}
              videoLoading={videoLoading}
              setIsCommentModalVisible={setIsCommentModalVisible}
            />
          </View>
        }
        data={loading ? [1] : [1, ...data]}
        scrollEnabled={!loading}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loadMoreLoading ? (
            <ActivityIndicator
              size={40}
              color={Colors.dark.purple}
              style={{ marginBottom: 30 }}
            />
          ) : null
        }
      />
    </>
  );
};

const ChannelDescription = ({ username, data, userLoading }: any) => {
  const [user, setUser] = useState<any>(data);
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth();
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    setUser(data);
  }, [data]);

  const colorScheme = useColorScheme();

  const handleClick = async () => {
    if (loading || userLoading) return;
    try {
      setLoading(true);
      if (!currentUser.user) {
        showErrorSnackbar("login to subscribe");
        setLoading(false);
        router.push("/login");
        return;
      }
      const res = await mversePatch(
        "/api/user/channel/" + currentUser.user.username,
        {}
      );
      if (res.success) {
        if (res.data.message == "unsubscribed") {
          setUser({
            ...user,
            isSubscribed: false,
            subscribers: user.subscribers - 1,
          });
        }
        if (res.data.message == "subscribed") {
          setUser({
            ...user,
            isSubscribed: true,
            subscribers: user.subscribers + 1,
          });
        }

        showSuccessSnackbar(res.data.message);
      } else {
        showErrorSnackbar(res.error);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      showErrorSnackbar(error.message);
    }
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        justifyContent: "space-between",
        paddingHorizontal: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
        <Link href={`/profile/${username}`}>
          <TouchableOpacity>
            <GenerateUserPicture user={user} size={35} />
          </TouchableOpacity>
        </Link>
        <View>
          {!userLoading ? (
            <>
              <Text numberOfLines={1}>{user.channelName}</Text>
              <Text style={{ fontSize: 12 }}>
                {handleNumbers(user.subscribers)} subscribers
              </Text>
            </>
          ) : (
            <>
              <View
                style={{
                  paddingHorizontal: 50,
                  paddingVertical: 5,
                  marginVertical: 5,
                  backgroundColor: Colors[colorScheme ?? "light"].secondary,
                }}
              ></View>
              <View
                style={{
                  width: 40,
                  paddingVertical: 5,
                  backgroundColor: Colors[colorScheme ?? "light"].secondary,
                }}
              ></View>
            </>
          )}
        </View>
      </View>
      <LogoButton
        onPress={handleClick}
        label={
          userLoading ? " " : user.isSubscribed ? "unsubscribe" : "subscribe"
        }
        style={{ borderRadius: 100, paddingHorizontal: userLoading ? 50 : 20 }}
      />
    </View>
  );
};

export default MyPlayerPlayPage;
