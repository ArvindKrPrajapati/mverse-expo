import React from "react";
import {
  useLocalSearchParams,
  useGlobalSearchParams,
  useRouter,
  useNavigation,
} from "expo-router";
import { Text, View } from "../../components/Themed";
import Button from "../../components/Button";
import { useAuth } from "../../Providers/AuthProvider";
import { useSnackbar } from "../../Providers/SnackbarProvider";

const ProfileScreen = (props: any) => {
  const glob = useGlobalSearchParams();
  const usernamr = glob.username;
  const router = useRouter();
  const { showSuccessSnackbar } = useSnackbar();
  const { navigate } = useNavigation();

  const { logout } = useAuth();
  const logMeOut = () => {
    logout();
    showSuccessSnackbar("Logged out successfully", 2000);
    // @ts-ignore
    navigate("(tabs)");
  };
  return (
    <View style={{ flex: 1 }}>
      <Text>{usernamr}</Text>
      <Button label="logout" onPress={logMeOut} />
    </View>
  );
};

export default ProfileScreen;
