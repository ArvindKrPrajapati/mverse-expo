import {
  ActivityIndicator,
  useColorScheme,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "../Providers/SnackbarProvider";
import { Text, View } from "./Themed";
import { mverseGet } from "../service/api.service";
import NotFound from "./NotFound";
import Colors from "../constants/Colors";
import { TouchableHighlight } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const limit = 20;
const PlayList = ({ username = "" }: any) => {
  const [skip, setSkip] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [end, setEnd] = useState(false);
  const { showErrorSnackbar } = useSnackbar();

  const _init = async (showLoader: boolean = false) => {
    try {
      setLoading(showLoader);
      setLoadMoreLoading(true);

      let url = "/api/user/playlist?type=private&skip=" + skip;
      if (username) {
        url = "/api/user/channel/" + username + "/playlist";
      }
      const res = await mverseGet(url);
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
  }, []);

  const loadMore = () => {
    if (loading || loadMoreLoading) return;
    !end ? setSkip((prev) => prev + limit) : null;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={50} color={Colors.dark.purple} />
      </View>
    );
  }

  if (!data.length) {
    return <NotFound message="no videos available" />;
  }
  return (
    <FlatList
      style={{ paddingVertical: 10 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      data={data}
      renderItem={({ item }: any) => <SinglePlaylist item={item} />}
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
  );
};

export default PlayList;

const SinglePlaylist = ({ item }: any) => {
  const router = useRouter();

  return (
    <TouchableHighlight
      onPress={() => {
        router.push(`/playlist/${item._id}`);
      }}
    >
      <View
        style={{
          padding: 10,
          flexDirection: "row",
        }}
      >
        <Image
          source={{ uri: item.latestVideo.latestVideo.thumbnail }}
          style={{
            borderRadius: 5,
            height: 90,
            aspectRatio: 16 / 10,
          }}
          resizeMode="cover"
        />
        <View
          style={[
            {
              flexDirection: "row",
              flex: 1,
            },
          ]}
        >
          <View
            style={{
              paddingHorizontal: 10,
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                marginBottom: 4,
                flexWrap: "wrap",
                lineHeight: 19,
                fontWeight: "600",
              }}
              numberOfLines={2}
            >
              {item?.name}
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {item.isPrivate ? (
                <MaterialCommunityIcons size={20} color="white" name="lock" />
              ) : (
                <MaterialCommunityIcons size={20} color="white" name="earth" />
              )}
              <Text style={styles.videoCount}>{item.videos} videos</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  videoCount: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
  },
});
