import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  useColorScheme,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Constants from "expo-constants";
import LogoButton from "../../components/LogoButton";
import { TextInput } from "react-native-paper";
import Colors from "../../constants/Colors";
import { useAuth } from "../../Providers/AuthProvider";
import GenerateUserPicture from "../../components/GenerateUserPicture";
import { Link, useRouter } from "expo-router";
import { useSnackbar } from "../../Providers/SnackbarProvider";
import { mversePost } from "../../service/api.service";
import { useRoute } from "@react-navigation/native";
import { Text } from "../../components/Themed";

const AddPost = () => {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const route = useRoute();
  // @ts-ignore
  const item = route.params.item || null;

  const handleSubmit = async () => {
    if (text.length == 0) {
      return;
    }
    try {
      setLoading(true);
      const res = await mversePost("/api/posts", {
        text,
        belongsTo: item ? item._id : null,
      });
      if (res.success) {
        showSuccessSnackbar("Post created");
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
  return (
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
            style={{ flexDirection: "row", paddingHorizontal: 20, gap: 10 }}
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
                  style={{ color: Colors[colorScheme ?? "dark"].secondaryText }}
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
            placeholderTextColor={Colors[colorScheme ?? "dark"].secondaryText}
            style={{
              backgroundColor: Colors[colorScheme ?? "dark"].background,
              flex: 1,
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default AddPost;
