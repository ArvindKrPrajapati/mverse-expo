import { FlatList, StyleSheet, useColorScheme } from "react-native";

import { Text, View } from "../../components/Themed";
import ProtectedContainer from "../../components/ProtectedContainer";
import {
  RefreshControl,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import Card from "../../components/Card";
import { useEffect, useState } from "react";
import { mverseGet } from "../../service/api.service";
import { useSnackbar } from "../../Providers/SnackbarProvider";
import LogoButton from "../../components/LogoButton";
import { useRouter } from "expo-router";
import CardSkeleton from "../../components/SkeletonLoader/CardSkeleton";

export default function Library() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const _init = async (showLoader: boolean = true) => {
    try {
      setLoading(showLoader);
      const res = await mverseGet("/api/library/history?limit=10");
      if (res.success) {
        setData(res.data);
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    _init();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await _init();
    setRefreshing(false);
  };

  return (
    <ProtectedContainer byId={true}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          paddingTop: 10,
          paddingBottom: 5,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>History</Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/playlist/history");
          }}
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={25}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme ?? "dark"].background }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <CardSkeleton history={true} />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ paddingHorizontal: 5 }}
            contentContainerStyle={{
              backgroundColor: Colors[colorScheme ?? "dark"].background,
            }}
            data={data}
            renderItem={({ item }: any) => <Card item={item} history={true} />}
            horizontal={true}
          />
        )}
        <View style={{ padding: 15 }}>
          <LogoButton
            label="Private Playlist"
            icon="lock-outline"
            iconSize={22}
            onPress={() => {
              router.push("/private-playlist");
            }}
          />
          <LogoButton
            label="Watch Later"
            icon="timer-outline"
            iconSize={22}
            onPress={() => {
              router.push("/playlist/watch-later");
            }}
          />
          <LogoButton
            label="Liked Videos"
            icon="thumb-up-outline"
            iconSize={22}
            onPress={() => {
              router.push("/playlist/liked-videos");
            }}
          />
          <LogoButton
            label="Disliked Videos"
            icon="thumb-down-outline"
            iconSize={22}
            onPress={() => {
              router.push("/playlist/disliked-videos");
            }}
          />
        </View>
      </ScrollView>
    </ProtectedContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
