import React, { useEffect, useState } from "react";
import { Text, View } from "../Themed";
import { ActivityIndicator, FlatList, useColorScheme } from "react-native";
import { useSnackbar } from "../../Providers/SnackbarProvider";
import { mverseGet } from "../../service/api.service";
import Colors from "../../constants/Colors";
import NotFound from "../NotFound";
import SinglePost from "../SinglePost";
const limit = 10;

type props = {
  id?: string;
  item?: any;
};
const AllPosts = ({ id, item }: props) => {
  const [skip, setSkip] = useState(0);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(item ? [item] : []);
  const [end, setEnd] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  const _init = async (showLoader: boolean = false) => {
    try {
      setLoading(showLoader);
      if (skip > 0) {
        setLoadMoreLoading(true);
      }
      const res = await mverseGet(
        `/api/posts${id ? "/" + id : ""}?limit=${limit}&skip=${skip}`
      );

      if (res.success) {
        res.data.length
          ? skip == 0
            ? setData(res.data)
            : setData([...data, ...res.data])
          : setEnd(true);
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message);
      console.log(error);
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    skip == 0 ? _init(true) : _init();
  }, [skip]);

  const loadMore = () => {
    if (loading || loadMoreLoading) return;
    !end && data.length == limit ? setSkip((prev) => prev + limit) : null;
  };

  if (!item && loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={50} color={Colors.dark.purple} />
      </View>
    );
  }
  const onRefresh = async () => {
    setRefreshing(true);
    if (skip == 0) {
      await _init();
      setSkip(0);
    }
  };

  const renderItem = ({ item, index }: any) => {
    if (id && index == 0) {
      return <SinglePost data={item} vertical={true} showLine={false} />;
    }
    return <SinglePost data={item} showLine={id ? true : false} />;
  };

  return (
    <FlatList
      ListEmptyComponent={<NotFound message="No post available" />}
      showsVerticalScrollIndicator={false}
      style={{ paddingBottom: 0 }}
      contentContainerStyle={{
        paddingBottom: 20,
        flexGrow: 1,
        backgroundColor: Colors[colorScheme ?? "dark"].background,
      }}
      data={data}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={
        <>
          {loadMoreLoading ? (
            <ActivityIndicator
              size={40}
              color={Colors.dark.purple}
              style={{ marginBottom: 30, marginTop: 15 }}
            />
          ) : null}
          {item && loading ? (
            <ActivityIndicator
              size={40}
              color={Colors.dark.purple}
              style={{ marginBottom: 30, marginTop: 15 }}
            />
          ) : null}
        </>
      }
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

export default AllPosts;
