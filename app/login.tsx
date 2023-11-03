import { StatusBar } from "expo-status-bar";
import { Image, Platform, StyleSheet, useColorScheme } from "react-native";
import React, { useState, useEffect } from "react";

import { Text, View } from "../components/Themed";
import Input from "../components/Input";
import Button from "../components/Button";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSnackbar } from "../Providers/SnackbarProvider";
import { mversePost } from "../service/api.service";
import { useAuth } from "../Providers/AuthProvider";
import { Link, useNavigation, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
const darkLogo = require("../assets/images/darkLogo.png");
const logo = require("../assets/images/logo.png");

export default function LoginScreen() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const colorScheme = useColorScheme();
  const { updateUser } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  const [previousRoute, setPreviousRoute] = useState("");
  const [previousRouteParams, setPreviousRouteParams] = useState({});

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", (e) => {
      const previousState = e.data.state.routes.slice(-2)[0];
      setPreviousRoute(previousState?.name || "");
      setPreviousRouteParams(previousState?.params || {});
    });

    return unsubscribe;
  }, [navigation]);

  const handleChange = (input: string, e: string) => {
    switch (input) {
      case "email":
        setEmail(e);
        break;
      case "password":
        setPassword(e);
        break;

      default:
        break;
    }
  };

  const handleValidate = () => {
    if (!email) {
      showErrorSnackbar("Email is required");
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showErrorSnackbar("Invalid email");
      return false;
    }
    if (!password) {
      showErrorSnackbar("Password is required");
      return false;
    }
    if (password.length < 7) {
      showErrorSnackbar("Password should be atleast 8 digit");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!handleValidate()) {
      return;
    }
    try {
      setLoading(true);
      const res = await mversePost("/api/auth/login", {
        email,
        password,
      });
      if (res.success) {
        updateUser(res.data);
        await AsyncStorage.setItem("token", res.token);
        showSuccessSnackbar("login successfully", 2000, 70);
        const paramsToPass = {
          ...previousRouteParams,
          refresh: true,
        };

        // @ts-ignore
        navigation.navigate(previousRoute, paramsToPass);
      } else {
        showErrorSnackbar(res.error);
      }
      setLoading(false);
    } catch (error: any) {
      showErrorSnackbar(error.message);
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={colorScheme == "dark" ? darkLogo : logo}
        style={{
          height: 70,
          resizeMode: "contain",
          width: colorScheme == "dark" ? 140 : 160,
          marginLeft: colorScheme == "dark" ? -10 : -20,
          alignSelf: "flex-start",
          marginBottom: 15,
        }}
      />
      <Text
        style={{
          marginBottom: 20,
          fontSize: 18,
          fontWeight: "bold",
          borderBottomWidth: 1,
          borderBottomColor: "grey",
          width: "100%",
          paddingBottom: 10,
        }}
      >
        Welcome back | Login
      </Text>
      <Input
        type="eamil"
        label="Email"
        onChange={(e) => handleChange("email", e)}
        value={email}
      />
      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => handleChange("password", e)}
        // parentClassName="mb-6"
      />
      <Button
        disabled={loading}
        label={loading ? "processing....." : "Login"}
        onPress={handleSubmit}
      />
      <View
        style={{ flexDirection: "row", alignItems: "baseline", marginTop: 10 }}
      >
        <Text style={styles.text}>Don't have an account?{"  "}</Text>
        <Link href="/signup" style={{ paddingTop: 5 }}>
          <TouchableOpacity disabled={loading}>
            <Text style={styles.linkText}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  text: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    color: "gray", // Change the color as needed
  },
  linkText: {
    color: "#643DFF",
    fontSize: 14,
  },
});
