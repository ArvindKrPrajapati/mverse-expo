import { View, Modal, useColorScheme } from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";
import { Text } from "./Themed";
import Input from "./Input";
import Button from "./Button";
import { RadioButton } from "react-native-paper";
import { useSnackbar } from "../Providers/SnackbarProvider";
import { mversePost } from "../service/api.service";

const CreateNewPlaylist = ({ isVisible, setIsVisible, videoId }: any) => {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState("true");
  const [name, setName] = useState("");
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();

  async function handleSubmit() {
    try {
      setLoading(true);
      if (!name) return;
      const obj = {
        name,
        isPrivate,
        videoId,
      };
      const res = await mversePost("/api/user/playlist", obj);
      if (res.success) {
        showSuccessSnackbar(res.data.message);
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
      setLoading(false);
      setIsVisible(false);
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      statusBarTranslucent={true}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.8)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: Colors[colorScheme ?? "light"].background,
            padding: 15,
            width: "95%",
            borderRadius: 5,
          }}
        >
          <Text style={{ fontWeight: "100", fontSize: 18, marginBottom: 10 }}>
            New Playlist
          </Text>
          <Input
            type="text"
            label="Name"
            onChange={(e) => setName(e)}
            value={name}
          />
          <RadioButton.Group
            onValueChange={(newValue) => setIsPrivate(newValue)}
            value={isPrivate}
          >
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>Private</Text>
                <RadioButton value="true" />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>Public</Text>
                <RadioButton value="false" />
              </View>
            </View>
          </RadioButton.Group>
          <Button
            disabled={loading}
            label={loading ? "processing....." : "create"}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CreateNewPlaylist;
