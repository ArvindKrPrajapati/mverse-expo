import { View, Text, Share } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import LogoButton from "./LogoButton";
import { handleNumbers } from "../utils/common";
import { useAuth } from "../Providers/AuthProvider";
import { useSnackbar } from "../Providers/SnackbarProvider";
import { useRouter } from "expo-router";
import { baseUrl, mversePost } from "../service/api.service";

const ActionButtons = ({
  videoId,
  likes = 0,
  dislikes = 0,
  reaction,
  videoLoading,
  setIsCommentModalVisible,
  comments = 0,
}: any) => {
  const [localLikes, setLocalLikes] = useState(likes);
  const [localDislikes, setLocalDislikes] = useState(dislikes);
  const [localReaction, setLocalReaction] = useState(reaction);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const handleShare = async () => {
  //   await share("title", "test", window.location.href);
  // };
  const { user } = useAuth();
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();

  const shareToApp = async () => {
    try {
      const url = baseUrl + "/play/" + videoId;
      const result = await Share.share({ message: url });
      // if (result.action === Share.sharedAction) {
      //   if (result.activityType) {
      //     // shared with activity type of result.activityType
      //   } else {
      //     // shared
      //   }
      // } else if (result.action === Share.dismissedAction) {
      //   // dismissed
      // }
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
    }
  };

  const handleReaction = async (type: string) => {
    if (loading) return;
    if (!user?._id) {
      showErrorSnackbar("login to subscribe");
      router.push("/login");
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
      const res = await mversePost("/api/video/reaction", {
        type,
        videoId,
      });
      if (res.success) {
        // showSuccessSnackbar(res.data.message);
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLocalLikes(likes);
    setLocalDislikes(dislikes);
    setLocalReaction(reaction);
  }, [likes, dislikes, reaction]);

  if (videoLoading) {
    return null;
  }
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <LogoButton
        iconSize={17}
        onPress={() => handleReaction("like")}
        icon={localReaction == "like" ? "thumb-up" : "thumb-up-outline"}
        label={localLikes ? handleNumbers(localLikes) : ""}
        style={{ backgroundColor: "transparent" }}
      />
      <LogoButton
        iconSize={17}
        onPress={() => handleReaction("dislike")}
        icon={localReaction == "dislike" ? "thumb-down" : "thumb-down-outline"}
        label={localDislikes ? handleNumbers(localDislikes) : ""}
        style={{ backgroundColor: "transparent", marginHorizontal: 5 }}
      />
      <LogoButton
        iconSize={17}
        onPress={() => setIsCommentModalVisible(true)}
        icon="comment-outline"
        label={comments ? handleNumbers(comments) : ""}
        style={{ backgroundColor: "transparent", marginHorizontal: 5 }}
      />
      <LogoButton
        iconSize={17}
        onPress={shareToApp}
        icon="share-outline"
        label="share"
        style={{ backgroundColor: "transparent", marginHorizontal: 5 }}
      />
    </ScrollView>
  );
};

export default ActionButtons;
