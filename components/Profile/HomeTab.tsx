import { View, Text, ActivityIndicator,FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { useGlobalSearchParams } from "expo-router";
import { mverseGet } from "../../service/api.service";
import { useSnackbar } from "../../Providers/SnackbarProvider";
import NotFound from "../NotFound";
import {  ScrollView } from "react-native-gesture-handler";
import Card from "../Card";
import Colors from "../../constants/Colors";

const HomeTab = () => {
  const glob = useGlobalSearchParams();
  const username = glob.username;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const [refreshing, setRefreshing] = useState(false);

  const _init = async (showLoader: boolean = true) => {
    try {
      setLoading(showLoader);
      const res = await mverseGet(
        "/api/user/channel/" + username + "/videos?limit=5"
      );
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
    await _init(false);
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
    ListEmptyComponent={<NotFound message="No video found"/>}
      style={{ paddingVertical: 10 }}
      contentContainerStyle={{flexGrow:1}}
      data={data}
      renderItem={({ item }: any) => <Card item={item} />}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

export default HomeTab;
