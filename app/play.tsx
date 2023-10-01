import React, { useEffect, useState } from "react";
import { Text, View } from "../components/Themed";
import { useRoute } from "@react-navigation/native";
import MversePlayer from "../components/Player/MversePlayer";
import { ActivityIndicator, FlatList, useColorScheme } from "react-native";
import Card from "../components/Card";
import Colors from "../constants/Colors";
import LogoButton from "../components/LogoButton";
import { formatDate, handleNumbers } from "../utils/common";
import GenerateUserPicture from "../components/GenerateUserPicture";
import { useSnackbar } from "../Providers/SnackbarProvider";
import { mverseGet } from "../service/api.service";
import CardSkeleton from "../components/SkeletonLoader/CardSkeleton";

const orientationEnum = [
  "UNKNOWN",
  "PORTRAIT_UP",
  "PORTRAIT_DOWN",
  "LANDSCAPE_LEFT",
  "LANDSCAPE_RIGHT",
];
const limit = 10;

const PlayPage = () => {
  const route = useRoute();
  // @ts-ignore
  const item = route.params.item || null;
  const colorScheme = useColorScheme();

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
          item.by.username +
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

  const renderItem = ({ item: obj, index }: any) => {
    return obj == 1 ? (
      <>
        <ChannelDescription item={item} />
        {loading ? <CardSkeleton horizontal={false} size={3} /> : null}
      </>
    ) : (
      <Card item={obj} horizontal={false} />
    );
  };
  return (
    <>
      <MversePlayer
        url={item.link}
        poster={item.thumbnail}
        title={item.title}
      />
      <FlatList
        style={{ paddingBottom: 20 }}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[1]}
        ListHeaderComponent={
          <View style={{ padding: 10 }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "100",
                fontFamily: "sans-serif",
              }}
            >
              {item.title}
            </Text>
            <Text style={{ fontSize: 13 }}>
              {handleNumbers(item.views)} views {formatDate(item.createdAt)}
            </Text>
            <LogoButton
              icon="chevron-down"
              numberOfLines={2}
              label={item.description}
              style={{
                flexDirection: "row-reverse",
                backgroundColor: "transparent",
                padding: 0,
              }}
              textColor={Colors[colorScheme ?? "light"].secondaryText}
              textStyle={{
                flex: 1,
                fontSize: 13,
              }}
            />
          </View>
        }
        data={loading ? [1] : [1, ...data]}
        scrollEnabled={!loading}
        renderItem={renderItem}
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
    </>
  );
};

const ChannelDescription = ({ item }: any) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        justifyContent: "space-between",
        paddingHorizontal: 5,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
        <GenerateUserPicture user={item.by} size={35} />
        <View>
          <Text numberOfLines={1}>{item.by.channelName}</Text>
          <Text style={{ fontSize: 12 }}>
            {handleNumbers(2000)} subscribers
          </Text>
        </View>
      </View>
      <LogoButton
        label="subscribe"
        style={{ borderRadius: 100, paddingHorizontal: 20 }}
      />
    </View>
  );
};

export default PlayPage;
