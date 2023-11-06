import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Share } from "react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  useColorScheme,
} from "react-native";
import Colors from "../constants/Colors";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Text, View } from "./Themed";
import { baseUrl, mversePost } from "../service/api.service";
import { useSnackbar } from "../Providers/SnackbarProvider";
import { useAuth } from "../Providers/AuthProvider";
import AddToPlaylist from "./AddToPlaylist";
import LogoButton from "./LogoButton";
import CreateNewPlaylist from "./CreateNewPlaylist";
import { TouchableRipple } from "react-native-paper";

const VideoMenu = ({ _id }: any) => {
  const colorScheme = useColorScheme();
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [addToPlaylistModal, setAddToPlaylistModal] = useState(false);
  const [newPlaylistModal, setNewPlaylistModal] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const addToWatchLater = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await mversePost("/api/user/playlist", {
        videoId: _id,
        name: "Watch later",
        isPrivate: true,
      });
      if (res.success) {
        setIsVisible(false);
        showSuccessSnackbar("Added successfully");
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAddToPlaylistModal = () => {
    setIsVisible(false);
    setAddToPlaylistModal(true);
  };

  const shareToApp = async () => {
    try {
      const url = baseUrl + "/play/" + _id;
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
      setIsVisible(false);
    }
  };
  return (
    <>
      {addToPlaylistModal ? (
        <AddToPlaylist
          isVisible={addToPlaylistModal}
          setIsVisible={setAddToPlaylistModal}
          videoId={_id}
          setNewPlaylistModal={setNewPlaylistModal}
        />
      ) : null}

      {newPlaylistModal ? (
        <CreateNewPlaylist
          isVisible={newPlaylistModal}
          setIsVisible={setNewPlaylistModal}
          videoId={_id}
        />
      ) : null}

      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        statusBarTranslucent={true}
      >
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Pressable
            onPress={() => setIsVisible(false)}
            style={{ flexGrow: 1 }}
          ></Pressable>
          <View style={{ padding: 2, paddingBottom: 0 }}>
            <View
              style={{
                backgroundColor: Colors[colorScheme ?? "light"].secondary,
                padding: 10,
                borderRadius: 5,
              }}
            >
              {user ? (
                <>
                  <Pressable
                    onPress={addToWatchLater}
                    style={{
                      padding: 5,
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    {({ pressed }) => (
                      <>
                        {loading ? (
                          <ActivityIndicator
                            size={25}
                            color={Colors.dark.purple}
                            style={{ marginRight: 15 }}
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name="timer-outline"
                            size={25}
                            color={Colors[colorScheme ?? "light"].text}
                            style={{
                              marginRight: 15,
                              opacity: pressed ? 0.5 : 1,
                            }}
                          />
                        )}
                        <Text
                          style={{
                            color: Colors[colorScheme ?? "light"].text,
                            opacity: pressed ? 0.5 : 1,
                          }}
                        >
                          Add to watchlist
                        </Text>
                      </>
                    )}
                  </Pressable>
                  {/* add to playlist */}
                  <LogoButton
                    onPress={toggleAddToPlaylistModal}
                    icon="plus-box-multiple-outline"
                    style={{ gap: 20 }}
                    label="Add to Playlist"
                  />
                </>
              ) : null}
              <Pressable
                onPress={shareToApp}
                style={{
                  padding: 5,
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                {({ pressed }) => (
                  <>
                    <MaterialCommunityIcons
                      name="share-outline"
                      size={25}
                      color={Colors[colorScheme ?? "light"].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                    <Text
                      style={{
                        color: Colors[colorScheme ?? "light"].text,
                        opacity: pressed ? 0.5 : 1,
                      }}
                    >
                      share
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableRipple
        style={{ width: 30 }}
        onPress={() => {
          setIsVisible(true);
        }}
      >
        <MaterialCommunityIcons
          name="dots-vertical"
          size={20}
          color={Colors[colorScheme ?? "light"].text}
          style={{ marginRight: 15 }}
        />
      </TouchableRipple>
    </>
  );
};

export default VideoMenu;
