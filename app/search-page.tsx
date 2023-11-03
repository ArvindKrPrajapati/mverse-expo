import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Text, View } from "../components/Themed";
import { useSnackbar } from "../Providers/SnackbarProvider";
import { mverseGet } from "../service/api.service";
import { ActivityIndicator, useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import NotFound from "../components/NotFound";
import { FlatList } from "react-native";
import Card from "../components/Card";
const limit = 20;
const SearchPage = () => {
  const router = useRoute();
  // @ts-ignore
  const searchText = router.params?.search;
  const [skip, setSkip] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [end, setEnd] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const colorScheme = useColorScheme();

  const _init = async (showLoader: boolean = false) => {
    try {
      setLoading(showLoader);
      setLoadMoreLoading(true);

      const res = await mverseGet(
        "/api/search?name=" + searchText.trim() + "&skip=" + skip
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
    return <NotFound message={`No video found for "${searchText}"`} />;
  }
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      style={{
        paddingBottom: 20,
        backgroundColor: Colors[colorScheme ?? "dark"].background,
      }}
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
    />
  );
};

export default SearchPage;
