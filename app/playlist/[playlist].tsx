import React, { useEffect, useState } from "react";
import { Text, View } from "../../components/Themed";
import { useGlobalSearchParams } from "expo-router";
import { useSnackbar } from "../../Providers/SnackbarProvider";
import { mverseGet } from "../../service/api.service";
import { ActivityIndicator, FlatList, StyleSheet, Image } from "react-native";
import Card from "../../components/Card";
import Colors from "../../constants/Colors";
import NotFound from "../../components/NotFound";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const limit = 20;
const PlaylistVideoPage = () => {
  const glob = useGlobalSearchParams();
  const id = glob.playlist;
  const [skip, setSkip] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [end, setEnd] = useState(false);
  const [title, setTitle] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [playlist, setPlaylist] = useState<any>({});
  const [total, setTotal] = useState(null);

  const { showErrorSnackbar } = useSnackbar();
  const _init = async (showLoader: boolean = false) => {
    try {
      setLoading(showLoader);
      setLoadMoreLoading(true);
      let url = "/api/user/playlist/" + id + "?skip=" + skip;
      if (id == "watch-later") {
        setTitle("Watch Later");
        url = "/api/library/watch-later?skip=" + skip;
      } else if (id == "liked-videos") {
        setTitle("Liked Videos");
        url = "/api/library/reacted/like?skip=" + skip;
      } else if (id == "disliked-videos") {
        setTitle("Disliked Videos");
        url = "/api/library/reacted/dislike?skip=" + skip;
      } else if (id == "history") {
        setTitle("History");
        url = "/api/library/history?skip=" + skip;
      }

      const res = await mverseGet(url);
      if (res.success) {
        res.data.length ?skip==0 ? setData(res.data) : setData([...data, ...res.data]) : setEnd(true);
        if (res.playlist) {
          setPlaylist(res.playlist);
          setTotal(res.total);
          setTitle(res.playlist.name);
        }
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

  const onRefresh = async () => {
    setRefreshing(true);
    setSkip(0);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={50} color={Colors.dark.purple} />
      </View>
    );
  }

  return (
    <FlatList
      ListEmptyComponent={<NotFound message="no videos available" />}
      ListHeaderComponent={
        data.length ? (
          <View style={styles.container}>
            <Image
              source={{ uri: data[0].thumbnail }}
              style={styles.backgroundImage}
              blurRadius={5}
            />

            <View style={styles.content}>
              <Image
                source={{ uri: data[0].thumbnail }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "transaparent",
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  {/* @ts-ignore */}
                  {playlist?.name ? (
                    <>
                      <Text>
                        by{" "}
                        {playlist?.createdBy.channelName ||
                          playlist?.createdBy.name}
                      </Text>
                      <Text>{total} Videos</Text>
                    </>
                  ) : null}
                  {playlist?.name ? (
                    <>
                      {playlist.isPrivate ? (
                        <>
                          <MaterialCommunityIcons
                            name="lock"
                            size={20}
                            color="white"
                          />
                          <Text style={styles.infoText}>Private</Text>
                        </>
                      ) : (
                        <>
                          <MaterialCommunityIcons
                            name="earth"
                            size={20}
                            color="white"
                          />
                          <Text style={styles.infoText}>Public</Text>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name="lock"
                        size={20}
                        color="white"
                      />
                      <Text style={styles.infoText}>Private</Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>
        ) : null
      }
      style={{ paddingVertical: 10 }}
      contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
      data={data}
      renderItem={({ item }: any) => <Card item={item} />}
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
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 10,
    height: 350,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "cover",
  },
  content: {
    alignItems: "center",
    padding: 16,
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  image: {
    width: "100%",
    height: "80%",
    borderRadius: 8,
  },
  textContainer: {
    marginLeft: 10,
    marginTop: 10,
    width: "100%",
    backgroundColor: "transaparent",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 15,
    marginRight: 5,
    color: "#eee",
  },
  infoText: {
    fontSize: 15,
    color: "#eee",
  },
});

export default PlaylistVideoPage;
