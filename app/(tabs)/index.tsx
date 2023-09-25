import {
  StyleSheet,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Text, View } from "../../components/Themed";
import { Link } from "expo-router";
import { useSnackbar } from "../../Providers/SnackbarProvider";
import { mverseGet } from "../../service/api.service";
import Colors from "../../constants/Colors";
import NotFound from "../../components/NotFound";
import Card from "../../components/Card";
const limit = 20;

export default function Home() {
  const [skip, setSkip] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [end, setEnd] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const [refreshing, setRefreshing] = useState(false);

  const _init = async (showLoader: boolean = false) => {
    try {
      setLoading(showLoader);
      setLoadMoreLoading(true);

      const res = await mverseGet(
        "/api/video?limit=" + limit + "&skip=" + skip
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
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await mverseGet("/api/video?limit=" + limit + "&skip=0");
      if (res.success) {
        setData(res.data);
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
      setRefreshing(false);
    }
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
      renderItem={({ item }: any) => <Card horizontal={false} item={item} />}
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
}
