import {
  View,
  Modal,
  Pressable,
  useColorScheme,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import LogoButton from "./LogoButton";
import Colors from "../constants/Colors";
import { Text } from "./Themed";
import { mverseGet, mversePatch } from "../service/api.service";
import { useSnackbar } from "../Providers/SnackbarProvider";
import NotFound from "./NotFound";
const limit = 20;

const AddToPlaylist = ({ isVisible, setIsVisible, videoId,setNewPlaylistModal }: any) => {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [data, setData] = useState<any>([]);
  const [end, setEnd] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();

  const _init = async (showLoader: boolean = false) => {
    try {
      setLoading(showLoader);
      setLoadMoreLoading(true);

      const res = await mverseGet(
        "/api/user/playlist?limit=" + limit + "&skip=" + skip
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
  const handleSubmit = async (item: any) => {
    try {
      const res = await mversePatch("/api/user/playlist/" + item._id, {
        videoId,
      });
      let message = "";
      if (res.success) {
        message = "Added to playlist";
      } else {
        message = res.error;
      }
      showSuccessSnackbar(message);
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
      setIsVisible(false);
    }
  };

  const openNewPlaylistModal=()=>{
    setIsVisible(false)
    setNewPlaylistModal(true)
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      statusBarTranslucent={true}
    >
      <View
        style={{
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* todo */}
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        >
          <Pressable
            onPress={() => setIsVisible(false)}
            style={{ flexGrow: 1 }}
          ></Pressable>
          <View>
            <View
              style={{
                backgroundColor: Colors[colorScheme ?? "light"].secondary,
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 5,
                  paddingHorizontal: 15,
                }}
              >
                <Text style={{fontWeight:"bold"}}>Add To Playlist</Text>
                <LogoButton
                  label="New Playlist"
                  style={{ backgroundColor: "transaparent" }}
                  icon="plus"
                  onPress={openNewPlaylistModal}
                />
              </View>
              {loading ? (
                <View style={{ padding: 10, paddingBottom: 15 }}>
                  <ActivityIndicator size={40} color={Colors.dark.purple} />
                </View>
              ) : (
                <FlatList
                  ListEmptyComponent={
                    !loadMoreLoading ? (
                      <NotFound
                        message="No playlist found"
                        style={{
                          backgroundColor: "transparent",
                          paddingBottom: 15,
                        }}
                      />
                    ) : null
                  }
                  contentContainerStyle={{ flexGrow: 1,paddingBottom:16 }}
                  style={{ paddingBottom: 20,paddingHorizontal:5,maxHeight:250}}
                  data={data}
                  renderItem={({ item }) => (
                    <AddToPlaylistButton
                      item={item}
                      handleSubmit={handleSubmit}
                    />
                  )}
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
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddToPlaylist;

const AddToPlaylistButton = ({ item, handleSubmit }: any) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    await handleSubmit(item);
    setLoading(false);
  };
  return (
    <LogoButton
      label={item.name}
      textStyle={{flexGrow:1,flex:1}}
      icon={loading ? "" : "plus"}
      numberOfLines={1}
      style={{ backgroundColor: "transparent" ,padding:7}}
      rightIcon={item.isPrivate ? "lock" : "earth"}
      onPress={handleClick}
      loading={loading}
    />
  );
};
