import { View, Text, ActivityIndicator, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { useGlobalSearchParams } from "expo-router";
import { mverseGet } from "../../service/api.service";
import { useSnackbar } from "../../Providers/SnackbarProvider";
import NotFound from "../NotFound";
import { ScrollView } from "react-native-gesture-handler";
import Card from "../Card";
import Colors from "../../constants/Colors";

const limit = 10;
const VideosTab = () => {
  const glob = useGlobalSearchParams();
  const username = glob.username;
  const [skip, setSkip] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [end, setEnd] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();

  const _init = async (showLoader: boolean = false) => {
    try {
      setLoading(showLoader);
      setLoadMoreLoading(true);

      const res = await mverseGet(
        "/api/user/channel/" +
          username +
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={50} color={Colors.dark.purple} />
      </View>
    );
  }
  if (!data.length) {
    return <NotFound />;
  }
  return (
    <FlatList
      style={{ paddingVertical: 10, paddingBottom: 20 }}
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
    />
  );
};

export default VideosTab;
