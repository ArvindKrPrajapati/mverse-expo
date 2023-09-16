import React, { useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { useAuth } from "../Providers/AuthProvider";
import Input from "../components/Input";
import { useRouter } from "expo-router";
import { mverseGet, mversePost } from "../service/api.service";
import { useSnackbar } from "../Providers/SnackbarProvider";
import Button from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateChannel = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { updateUser } = useAuth();
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const [data, setData] = useState([]);

  const validateNameLength = (name: string) => {
    return name.length <= 3;
  };

  const handleChange = async (text: string) => {
    setName(text);
    if (validateNameLength(text)) {
      setData([]);
      return;
    }
    try {
      setSearching(true);
      const res = await mverseGet("/api/user/channel?limit=1&name=" + text);
      if (res.success) {
        setData(res.data);
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async () => {
    if (validateNameLength(name) || data.length) {
      showErrorSnackbar("Invalid channel name");
      return;
    }

    try {
      setLoading(true);
      const res = await mversePost("/api/user/channel", {
        channelName: name,
        description,
      });
      if (res.success) {
        updateUser(res.data);
        await AsyncStorage.setItem("token", res.token);
        showSuccessSnackbar("Channel created successfully");
        router.replace(`/profile/${res.data.username}`);
      } else {
        showErrorSnackbar(res.error);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      showErrorSnackbar(error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>hi! {user?.name}</Text>
      <View>
        <Input
          type="text"
          maxLength={25}
          label="Your channel name *"
          parentStyle={{ marginBottom: -7 }}
          onChange={(e) => handleChange(e)}
        />
        <Text style={styles.helperText}>
          {!validateNameLength(name) && !searching ? (
            <View>
              {!data.length ? (
                <Text style={styles.availableText}>{name} is available</Text>
              ) : (
                <Text style={styles.notAvailableText}>
                  {name} is not available
                </Text>
              )}
            </View>
          ) : (
            <Text>
              {searching
                ? "searching..."
                : "Enter at least 4 letters to search"}
            </Text>
          )}
        </Text>
        <Input
          type="textarea"
          label="Description"
          multiline={true}
          inputStyle={{ maxHeight: 120, height: 70 }}
          parentStyle={{ marginTop: 20 }}
          onChange={(e) => setDescription(e)}
        />
        <Button
          label={loading ? "processing.." : "Create channel"}
          onPress={handleSubmit}
          disabled={loading || searching}
          style={{ marginTop: 15 }}
        />
      </View>
    </View>
  );
};

export default CreateChannel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingVertical: 30,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
  },
  availableText: {
    color: "green",
  },
  notAvailableText: {
    color: "red",
  },
  button: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
});
