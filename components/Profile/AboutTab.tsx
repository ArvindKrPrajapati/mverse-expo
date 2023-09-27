import React, { useEffect, useState } from "react";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import { Text, View } from "../Themed";
import { useAuth } from "../../Providers/AuthProvider";
import { useSnackbar } from "../../Providers/SnackbarProvider";
import { mverseGet, mversePatch } from "../../service/api.service";
import { ActivityIndicator,useColorScheme } from "react-native";
import Colors from "../../constants/Colors";
import NotFound from "../NotFound";
import Button from "../Button";
import GenerateUserPicture from "../GenerateUserPicture";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

const AboutTab = () => {
  const glob = useGlobalSearchParams();
  const username = glob.username;

  const { user } = useAuth();
  const router = useRouter();
const colorScheme=useColorScheme()

  const { showSuccessSnackbar, showErrorSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const _init = async (showLoader: boolean = true) => {
    try {
      setLoading(showLoader);
      const res = await mverseGet("/api/user/channel/" + username);
      if (res.success) {
        setUserInfo(res.data);
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

  useEffect(() => {
    if (glob.refresh) {
      _init();
    }
  }, [glob]);

  const handleClick = async () => {
    try {
      if (!user) {
        showErrorSnackbar("login to subscribe");
        router.push("/login");
        return;
      }
      setSubscribing(true);

      const res = await mversePatch("/api/user/channel/" + username, {});
      if (res.success) {
        showSuccessSnackbar(res.data.message);
        await _init(false);
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
      setSubscribing(false);
    }
  };
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
    <View style={{ flex: 1 }}>
      {userInfo ? (
        <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >
          <GenerateUserPicture type="cover" user={userInfo} />
          <View style={{ alignItems: "center", paddingVertical: 25 }}>
            <GenerateUserPicture type="dp" user={userInfo} size={100} />
            <Text style={{ fontSize: 27, fontWeight: "bold", marginTop: 5 }}>
              {userInfo.channelName}
            </Text>
            <Text>{userInfo.username}</Text>
            <Text
              style={{
                color: Colors[colorScheme ?? "light"].secondaryText,
                marginVertical: 5,
                fontSize: 12,
              }}
            >
              {userInfo.subscribers} Subscribers {userInfo.videos} Videos{" "}
              {"\n\n"}
              {userInfo.description}
            </Text>
            <Button
              onPress={handleClick}
              disabled={subscribing}
              style={{ width: 150, borderRadius: 50, marginVertical: 10 }}
              label={userInfo.isSubscribed ? "unsubscribe" : "subscribe"}
            />
          </View>
        </ScrollView>
      ) : (
       <Redirect href={`/error?message=${encodeURIComponent("User Not Found")}`} />
      )}
    </View>
  );
};

export default AboutTab;
