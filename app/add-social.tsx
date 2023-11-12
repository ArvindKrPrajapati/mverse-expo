import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  useColorScheme,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Constants from "expo-constants";
import { TextInput } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../Providers/AuthProvider";
import { useSnackbar } from "../Providers/SnackbarProvider";
import { mversePost, uploadImgFile } from "../service/api.service";
import Colors from "../constants/Colors";
import LogoButton from "../components/LogoButton";
import GenerateUserPicture from "../components/GenerateUserPicture";
import { Text } from "../components/Themed";
import ProtectedContainer from "../components/ProtectedContainer";
import * as ImagePicker from "expo-image-picker";
import ShowImages from "../components/Social/ShowImages";

const MAX_IMG = 2;
const AddSocial = () => {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const route = useRoute();
  const [images, setImages] = useState<any>([]);
  // @ts-ignore
  const item = route.params.item || null;

  const handleSubmit = async () => {
    if (text.length == 0 && images.length == 0) {
      return;
    }

    try {
      setLoading(true);
      const remoteUrls: string[] = [];
      await Promise.all(
        images.map(async (item: any) => {
          let base64Img: any = `data:image/jpg;base64,${item.base64}`;

          const imgRes = await uploadImgFile(base64Img, (progress) => {});
          remoteUrls.push(imgRes.secure_url);
        })
      );
      const payload: any = {};
      if (text) {
        payload["text"] = text;
      }
      if (remoteUrls.length) {
        payload["images"] = remoteUrls;
      }
      if (item) {
        payload["belongsTo"] = item._id;
      }

      const res = await mversePost("/api/posts", payload);
      if (res.success) {
        showSuccessSnackbar("Post created");
        setText("");
        setImages([]);
        router.back();
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
      setText("");
      setLoading(false);
    }
  };

  const handleSelectImage = async () => {
    if (images.length == MAX_IMG) {
      showErrorSnackbar("Max 2 images", 500);
      return;
    }
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsMultipleSelection: true,
        selectionLimit: 4,
        base64: true,
      });

      if (!result.canceled) {
        const img: any = result.assets;
        setImages([...images, ...img]);
        // setMyUser({ ...myUser, [type]: img.uri });
        // let base64Img = `data:image/jpg;base64,${img.base64}`;
        // setImage(base64Img);
      }
    } catch (error: any) {
      console.log({ error: error.message });
    }
  };
  return (
    <ProtectedContainer>
      <View
        style={{
          backgroundColor: Colors[colorScheme ?? "dark"].background,
          flex: 1,
        }}
      >
        <View
          style={{
            marginTop: Constants.statusBarHeight,
            height: 50,
            // backgroundColor: "red",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 5,
          }}
        >
          <LogoButton
            icon="close"
            style={{ marginTop: 0, backgroundColor: "transparent" }}
            iconSize={23}
            onPress={() => router.back()}
          />
          <LogoButton
            style={{
              marginTop: 0,
              // backgroundColor: "transparent",
              borderRadius: 25,
              paddingHorizontal: 20,
              paddingVertical: 8,
              marginRight: 7,
            }}
            onPress={handleSubmit}
            textStyle={{ fontWeight: "600" }}
            label={loading ? "" : "Post"}
            loading={loading}
          />
        </View>
        {/* content */}
        <ScrollView>
          {item ? (
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <GenerateUserPicture user={item.user} size={35} />
                {/* line */}
                <View
                  style={{
                    width: 1.5,
                    flex: 1,
                    backgroundColor: Colors[colorScheme ?? "dark"].lineColor,
                  }}
                ></View>
              </View>
              <View style={{ flex: 1, paddingBottom: 5 }}>
                <Text style={{ flexDirection: "row" }} numberOfLines={1}>
                  <Text style={{ fontWeight: "500" }}>{item.user.name}</Text>
                  {"  "}
                  <Text
                    style={{
                      color: Colors[colorScheme ?? "dark"].secondaryText,
                    }}
                  >
                    {item.user.username}
                  </Text>
                </Text>
                <Text>{item.text}</Text>
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: Colors[colorScheme ?? "dark"].secondaryText,
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  Replying to{" "}
                  <Link
                    href={`/profile/${item.user.username}`}
                    style={{ color: Colors.default.blue }}
                  >
                    {item.user.username}
                  </Link>
                </Text>
              </View>
              <View style={{ width: "32%" }}>
                <ShowImages images={item.images} width="100%" square={true} />
              </View>
            </View>
          ) : null}
          <KeyboardAvoidingView
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              gap: 5,
              paddingTop: item ? 0 : 15,
            }}
          >
            <GenerateUserPicture user={user} size={35} />
            <View style={{ flex: 1 }}>
              <TextInput
                underlineColor="transparent"
                underlineColorAndroid="transparent"
                activeUnderlineColor="transparent"
                multiline={true}
                contentStyle={{
                  color: Colors[colorScheme ?? "dark"].text,
                  paddingLeft: 5,
                  paddingTop: 5,
                }}
                autoFocus={true}
                value={text}
                onChangeText={setText}
                placeholder={item ? "Reply to post" : "What are you thinking ?"}
                placeholderTextColor={
                  Colors[colorScheme ?? "dark"].secondaryText
                }
                style={{
                  backgroundColor: Colors[colorScheme ?? "dark"].background,
                  flex: 1,
                }}
              />
              <ShowImages images={images} />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <View
          style={{
            padding: 10,
            paddingHorizontal: 15,
            backgroundColor: Colors[colorScheme ?? "dark"].secondary,
          }}
        >
          <LogoButton
            icon="image-plus"
            onPress={handleSelectImage}
            style={{ marginTop: 0, backgroundColor: "transparent" }}
            textColor={Colors.default.purple}
          />
        </View>
      </View>
    </ProtectedContainer>
  );
};

export default AddSocial;
