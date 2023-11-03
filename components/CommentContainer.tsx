import {
  Dimensions,
  FlatList,
  View,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { mverseGet, mversePost } from "../service/api.service";
import { useSnackbar } from "../Providers/SnackbarProvider";
import { ActivityIndicator } from "react-native-paper";
import Colors from "../constants/Colors";
import NotFound from "./NotFound";
import Modal from "react-native-modal";
import LogoButton from "./LogoButton";
import Input from "./Input";
import GenerateUserPicture from "./GenerateUserPicture";
import { Text } from "./Themed";
import { handleNumbers } from "../utils/common";
import { useAuth } from "../Providers/AuthProvider";
const limit = 20;

const CommentContainer = ({
  videoId,
  isCommentModalVisible,
  setIsCommentModalVisible,
}: any) => {
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  const [comments, setComments] = useState<any>([]);
  const { showErrorSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState("");

  const [addingComment, setAddingComment] = useState(false);
  const flatListRef = useRef<FlatList<any> | null>(null);

  const _init = async (
    showLoader: boolean = false,
    loadMore = false,
    _skip = skip
  ) => {
    try {
      setLoading(showLoader);
      setLoadMoreLoading(loadMore);

      const res = await mverseGet(
        `/api/video/comment?skip=${_skip}&limit=${limit}&videoId=${videoId}`
      );
      if (res.success) {
        res.data.length
          ? _skip == 0
            ? setComments(res.data)
            : setComments([...comments, ...res.data])
          : setEnd(true);
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
    skip == 0 ? _init(true) : _init(false, true);
  }, [skip]);

  const loadMore = () => {
    if (loading || loadMoreLoading) return;
    !end ? setSkip((prev) => prev + limit) : null;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setEnd(false);
    await _init(false, false, 0);
    setRefreshing(false);
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const submitComment = async () => {
    if (!commentText) return;
    if (!user) {
      showErrorSnackbar("login first!");
      return;
    }
    const obj = {
      content: commentText,
      videoId,
    };
    try {
      setAddingComment(true);
      const res = await mversePost("/api/video/comment", obj);
      setCommentText("");
      if (res.success) {
        await _init(false, false, 0);
        scrollToTop();
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
      setCommentText("");
      setAddingComment(false);
    }
  };
  return (
    <Modal
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      isVisible={isCommentModalVisible}
      animationIn="slideInUp"
      hasBackdrop={false}
      onBackButtonPress={() => setIsCommentModalVisible(false)}
      coverScreen={false}
      useNativeDriver={true}
      style={{ margin: 0, justifyContent: "space-between", marginTop: 5 }}
    >
      <View
        style={{
          width: "100%",
          aspectRatio: 18 / 11,
        }}
      ></View>

      <View
        style={{
          width: "100%",
          aspectRatio: 11 / 17,
          backgroundColor: Colors[colorScheme ?? "light"].secondary,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: Colors[colorScheme ?? "light"].secondary,
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontWeight: "200", fontSize: 17 }}>Comments</Text>
          <LogoButton
            icon="close"
            onPress={() => setIsCommentModalVisible(false)}
          />
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          ref={flatListRef}
          contentContainerStyle={{ paddingHorizontal: 10, flexGrow: 1 }}
          ListEmptyComponent={
            loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size={40} color={Colors.dark.purple} />
              </View>
            ) : (
              <NotFound
                style={{ backgroundColor: "transparent" }}
                message="No comments found"
              />
            )
          }
          data={comments}
          renderItem={({ item }: any) => <SingleComment item={item} />}
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
          refreshing={refreshing}
          onRefresh={onRefresh}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
            paddingBottom: 15,
          }}
        >
          <Input
            type="textarea"
            multiline={true}
            inputStyle={{ marginBottom: 0, borderWidth: 0 }}
            parentStyle={{ width: "90%", marginBottom: 0 }}
            placeholder="Write comment..."
            value={commentText}
            onChange={(e) => setCommentText(e)}
          />
          <LogoButton
            onPress={submitComment}
            icon={addingComment ? "" : "send"}
            loading={addingComment}
            style={{ padding: 5, backgroundColor: "transparent" }}
            iconSize={25}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CommentContainer;

const SingleComment = (props: any) => {
  const [item, setItem] = useState(props.item);
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const { showErrorSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const [localLikes, setLocalLikes] = useState(item.likes);
  const [localDislikes, setLocalDislikes] = useState(item.dislikes);
  const [localReaction, setLocalReaction] = useState(item.reaction);

  useEffect(() => {
    setItem(props.item);
    setLocalLikes(props.item.likes);
    setLocalDislikes(props.item.dislikes);
    setLocalReaction(props.item.reaction);
  }, [props.item]);

  const handleReaction = async (type: string) => {
    if (loading) return;
    if (!user) {
      showErrorSnackbar("login first");
      return;
    }
    try {
      setLoading(true);
      if (!localReaction) {
        if (type == "like") {
          setLocalLikes((p: any) => p + 1);
          setLocalReaction("like");
        } else {
          setLocalDislikes((p: any) => p + 1);
          setLocalReaction("dislike");
        }
      } else if (localReaction == "like") {
        setLocalLikes((p: any) => p - 1);
        if (type == "like") {
          setLocalReaction("");
        } else {
          setLocalDislikes((p: any) => p + 1);
          setLocalReaction("dislike");
        }
      } else if (localReaction == "dislike") {
        setLocalDislikes((p: any) => p - 1);
        if (type == "dislike") {
          setLocalReaction("");
        } else {
          setLocalLikes((p: any) => p + 1);
          setLocalReaction("like");
        }
      }
      const res = await mversePost("/api/video/comment/react", {
        type,
        commentId: item._id,
      });
      if (res.success) {
        // toast.success(res.data.message);
        // router.refresh();
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{ padding: 5, flexDirection: "row", gap: 15, paddingBottom: 10 }}
    >
      <GenerateUserPicture user={item.author} size={30} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              color: Colors[colorScheme ?? "light"].secondaryText,
              flexWrap: "wrap",
              fontSize: 13,
            }}
          >
            {item.author.channelName || item.author.name}
            {" :  "}
            <Text>{item.content.trim()}</Text>
          </Text>
        </View>
        {/* like buttoms */}
        <View style={{ flexDirection: "row" }}>
          <LogoButton
            iconSize={15}
            onPress={() => handleReaction("like")}
            icon={localReaction == "like" ? "thumb-up" : "thumb-up-outline"}
            label={localLikes ? handleNumbers(localLikes) : ""}
            style={{
              backgroundColor: "transparent",
              paddingLeft: 0,
              paddingTop: 3,
            }}
          />
          <LogoButton
            iconSize={15}
            onPress={() => handleReaction("dislike")}
            icon={
              localReaction == "dislike" ? "thumb-down" : "thumb-down-outline"
            }
            label={localDislikes ? handleNumbers(localDislikes) : ""}
            style={{
              backgroundColor: "transparent",
              marginHorizontal: 5,
              paddingTop: 3,
            }}
          />
        </View>
      </View>
    </View>
  );
};
