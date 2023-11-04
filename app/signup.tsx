import { StatusBar } from "expo-status-bar";
import {
  Image,
  Platform,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from "react-native";
import React, { useState } from "react";

import { View } from "../components/Themed";
import Input from "../components/Input";
import Button from "../components/Button";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSnackbar } from "../Providers/SnackbarProvider";
import { mversePost } from "../service/api.service";
import { useAuth } from "../Providers/AuthProvider";
import { Link, useNavigation, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/Colors";
import { Text } from "react-native-paper";
import LogoButton from "../components/LogoButton";
const darkLogo = require("../assets/images/darkLogo.png");
const logo = require("../assets/images/logo.png");

const myColor = "#6F2DA8";

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const colorScheme = useColorScheme();
  const { updateRawEmail } = useAuth();
  const router = useRouter();
  const { navigate } = useNavigation();

  const handlePasswordToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (input: string, e: string) => {
    switch (input) {
      case "email":
        setEmail(e);
        break;
      case "name":
        setName(e);
        break;
      case "password":
        setPassword(e);
        break;

      default:
        break;
    }
  };

  const handleValidate = () => {
    if (!name) {
      showErrorSnackbar("Full name is required");
      return false;
    }
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
      const res = await mversePost("/api/auth/signup", {
        email,
        password,
        name,
      });
      if (res.success) {
        updateRawEmail(res.data.email);
        showSuccessSnackbar("OTP sent successfully");
        router.push("/verify-otp");
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
    <View
      style={{
        backgroundColor: myColor,
        // alignItems: "center",
        flexGrow: 1,
      }}
    >
      <StatusBar backgroundColor={myColor} style="light" />
      <Image
        source={logo}
        style={{
          height: 70,
          resizeMode: "contain",
          width: 160,
          marginTop: 25,
          alignSelf: "center",
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: Colors[colorScheme ?? "dark"].background,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderRadius: 10,
          margin: 12,
          padding: 25,
          flex: 1,
        }}
        contentContainerStyle={{
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        <View>
          <Text
            variant="headlineSmall"
            style={{
              alignSelf: "center",
              marginTop: 10,
              marginBottom: 16,
              color: Colors[colorScheme ?? "dark"].text,
            }}
          >
            Create new account
          </Text>
          <Input
            type="text"
            label="Full Name"
            onChange={(e) => handleChange("name", e)}
            value={name}
          />
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
            label={loading ? "Processing....." : "Sign up"}
            onPress={handleSubmit}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              marginTop: 10,
              alignSelf: "center",
            }}
          >
            <Text style={styles.text}>Already have an account?{"  "}</Text>
            <Link href="/login" style={{ paddingTop: 5 }}>
              <TouchableOpacity disabled={loading}>
                <Text style={styles.linkText}>Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <Text
            variant="titleMedium"
            style={{
              color: Colors[colorScheme ?? "dark"].text,
              alignSelf: "center",
              marginVertical: 30,
            }}
          >
            Or
          </Text>
          <LogoButton
            icon="google"
            label="Signup with Google"
            style={{ justifyContent: "center" }}
          />
        </View>
        <Text
          variant="labelLarge"
          style={{
            color: Colors[colorScheme ?? "dark"].text,
            alignSelf: "center",
          }}
        >
          By Shivraj Technology
        </Text>
      </ScrollView>
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
