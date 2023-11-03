import React, { useState } from "react";
import { Text, View } from "../components/Themed";
import ProtectedContainer from "../components/ProtectedContainer";
import { useColorScheme, Modal } from "react-native";
import Colors from "../constants/Colors";
import { useSnackbar } from "../Providers/SnackbarProvider";
import { useNavigation } from "expo-router";
import { useAuth } from "../Providers/AuthProvider";
import GenerateUserPicture from "../components/GenerateUserPicture";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { mverseGet, uploadImage } from "../service/api.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoButton from "../components/LogoButton";

const Settings = () => {
  const { showSuccessSnackbar } = useSnackbar();
  const { navigate } = useNavigation();

  const { logout } = useAuth();
  const logMeOut = async () => {
    await mverseGet("/api/auth/logout");
    logout();
    showSuccessSnackbar("Logged out successfully", 2000);
    // @ts-ignore
    navigate("(tabs)");
  };
  return (
    <ProtectedContainer byId={true}>
      <View style={{ flex: 1, padding: 15 }}>
        <Text style={{ marginBottom: 10 }}>User settings</Text>
        <ChangeImage type="dp" />
        <ChangeImage type="cover" />
        <LogoButton
          label="Logout"
          icon="logout"
          onPress={logMeOut}
          textColor="red"
        />
      </View>
    </ProtectedContainer>
  );
};

export default Settings;

const ChangeImage = ({ type }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const { user, updateUser } = useAuth();
  const [myUser, setMyUser] = useState(user);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const [image, setImage] = useState<any>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: type == "cover" ? [4, 1] : [4, 4],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      setMyUser({ ...myUser, [type]: img.uri });
      let base64Img = `data:image/jpg;base64,${img.base64}`;
      setImage(base64Img);
    }
  };

  const handleClose = () => {
    setImage("");
    setIsVisible(false);
    setMyUser(user);
  };
  const handleSave = async () => {
    if (!image) {
      showErrorSnackbar("select an image");
      return;
    }
    try {
      setLoading(true);
      setUploadProgress(0);
      const data = await uploadImage(image, type, (progress) => {
        setUploadProgress(progress);
      });

      if (data.success) {
        updateUser(data.data);
        setImage("");
        setUploadProgress(0);
        await AsyncStorage.setItem("token", data.token);
        showSuccessSnackbar("image uploaded successfully");
      } else {
        showErrorSnackbar(data.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
      setLoading(false);
      setIsVisible(false);
      setUploadProgress(0);
    }
  };
  return (
    <>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        statusBarTranslucent={true}
      >
        <View style={{ flex: 1, paddingVertical: 120, alignItems: "center" }}>
          <LogoButton
            icon="close"
            label={"Change " + type}
            iconSize={25}
            style={{
              position: "absolute",
              top: 0,
              alignItems: "center",
              borderRadius: 0,
              paddingTop: Constants.statusBarHeight + 10,
              width: "100%",
              paddingHorizontal: 20,
            }}
            onPress={handleClose}
          />

          <View style={{ padding: 10 }}>
            <GenerateUserPicture user={myUser} size={190} type={type} />
          </View>

          {loading ? (
            <View
              style={{
                width: "100%",
                position: "absolute",
                zIndex: 10,
                bottom: 10,
                padding: 15,
              }}
            >
              <View
                style={{
                  width: "100%",
                  backgroundColor: Colors[colorScheme ?? "light"].secondary,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                }}
              >
                <Text>{uploadProgress + " %"}</Text>
              </View>
            </View>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              gap: 15,
              padding: 15,
              paddingRight: image ? 30 : 15,
              position: "absolute",
              bottom: 10,
            }}
          >
            {!loading ? (
              <>
                <LogoButton
                  onPress={pickImage}
                  label="select image"
                  icon="pencil"
                  style={{
                    justifyContent: "center",
                    gap: 2,
                    width: image ? "50%" : "100%",
                  }}
                />
                {image ? (
                  <LogoButton
                    onPress={handleSave}
                    label="save"
                    icon="content-save-outline"
                    style={{
                      justifyContent: "center",
                      gap: 2,
                      width: "50%",
                    }}
                  />
                ) : null}
              </>
            ) : null}
          </View>
        </View>
      </Modal>
      <LogoButton
        label={"Change " + type}
        icon="pencil"
        onPress={() => setIsVisible(true)}
      />
    </>
  );
};


