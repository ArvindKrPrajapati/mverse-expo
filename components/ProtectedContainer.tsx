import React, { useEffect } from "react";
import { useAuth } from "../Providers/AuthProvider";
import { useSnackbar } from "../Providers/SnackbarProvider";
import { Link, useRouter } from "expo-router";
import { Text, View } from "./Themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Pressable, useColorScheme } from "react-native";
import Colors from "../constants/Colors";

export default function ProtectedContainer({
  children,
  byId = false,
  redirect = true,
}: {
  children: any;
  byId?: boolean;
  redirect?: boolean;
}) {
  const { user } = useAuth();
  const { showErrorSnackbar } = useSnackbar();
  const router = useRouter();
  const colorScheme = useColorScheme();
  useEffect(() => {
    if (!user) {
      showErrorSnackbar("login first");
      router.push("/login");
    } else if (!byId && !user.username) {
      showErrorSnackbar("create channel");
      router.push("/create-channel");
    }
    // eslint-disable-next-line
  }, []);
  if (byId && user?._id) {
    return <>{children}</>;
  }
  if (user?.username) {
    return <>{children}</>;
  }
  if (!redirect) {
    return null;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Not Authorized
        </Text>
        <Pressable
          onPress={() =>
            router.push(user && !user.username ? `/create-channel` : "/login")
          }
        >
          {({ pressed }) => (
            <Text
              style={{
                color: Colors[colorScheme ?? "light"].purple,
                opacity: pressed ? 0.5 : 1,
              }}
            >
              {user && !user.username ? "Create Channel" : "Login"}
            </Text>
          )}
        </Pressable>
        <View
          style={{ marginTop: 10, borderBottomWidth: 1, borderColor: "grey" }}
        />
      </View>
    </View>
  );
}
