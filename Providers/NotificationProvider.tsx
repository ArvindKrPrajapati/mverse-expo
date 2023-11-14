// AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mverseGet, mversePost } from "../service/api.service";
import { useAuth } from "./AuthProvider";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useSnackbar } from "./SnackbarProvider";
import Constants from "expo-constants";
// Define the context type
interface NotificationContextType {
  recieved: boolean;
  loading: boolean;
  skip: number;
  limit: number;
  loadMoreLoading: boolean;
  data: any;
  setData: (data: any) => void;
  setRecieved: (state: boolean) => void;
  loadNotification: (state?: boolean, skip?: number, limit?: number) => void;
}

// Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);
const _limit = 20;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
// Create the provider component
export const NotificationProvider = ({ children }: any) => {
  const [recieved, setRecieved] = useState(false);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [dataEnd, setDataEnd] = useState(false);
  const { user } = useAuth();
  const [skipState, setSkipState] = useState(0);
  const { showErrorSnackbar } = useSnackbar();

  const loadNotification = async (
    showLodaing: boolean = false,
    skip = 0,
    limit = _limit
  ) => {
    if (loading || loadMoreLoading) return;
    if (skip > 0 && dataEnd == true) {
      return;
    }

    setSkipState(skip);
    try {
      if (skip == 0) {
        setLoading(showLodaing);
      } else {
        setLoadMoreLoading(showLodaing);
      }
      const res = await mverseGet(
        `/api/posts/notification?skip=${skip}&limit=${limit}`
      );
      if (res.success) {
        const isRecieved = res.data.find((item: any) => item.seen == false);
        if (res.data.length < limit) {
          setDataEnd(true);
        } else {
          setDataEnd(false);
        }
        if (skip == 0) {
          setData(res.data);
        } else {
          setData([...data, ...res.data]);
        }
        setRecieved(isRecieved?._id ? true : false);
      }
    } catch (error: any) {
      // do nothing
      console.log(error.message);
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadNotification(true);
    }
  }, [user]);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      showErrorSnackbar("Failed to get push notification!");
      return;
    }

    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    });
    await mversePost("/api/posts/notification/token", { token: token.data });
  }

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        recieved,
        setRecieved,
        data,
        setData,
        loadNotification,
        loading,
        loadMoreLoading,
        skip: skipState,
        limit: _limit,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within an NotificationProvider"
    );
  }
  return context;
};
