import React, { useEffect, useState } from "react";
import { Text, View } from "../components/Themed";
import Input from "../components/Input";
import Button from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  useColorScheme,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSnackbar } from "../Providers/SnackbarProvider";
import { mversePost } from "../service/api.service";
import { useAuth } from "../Providers/AuthProvider";
import { Link, router } from "expo-router";

const darkLogo = require("../assets/images/darkLogo.png");
const logo = require("../assets/images/logo.png");

const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<any>();
  const [loading, setLoading] = useState(false);

  const { updateUser, logout } = useAuth();
  const colorScheme = useColorScheme();
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();

  const _init = async () => {
    const _email = await AsyncStorage.getItem("rawEmail");
    if (_email) {
      setEmail(_email);
    }
  };
  useEffect(() => {
    _init();
  }, []);

  const handleSubmit = async () => {
    const _otp = otp || 0;
    console.log(_otp);

    if (_otp.toString().length !== 6) {
      showErrorSnackbar("Otp should be 6 digit");
      return;
    }
    try {
      setLoading(true);
      const res = await mversePost("/api/auth/verifyotp", {
        email,
        otp,
      });

      if (res.success) {
        showSuccessSnackbar("Account created successfully");
        logout();
        await AsyncStorage.setItem("token", res.token);
        updateUser(res.data);
        // @ts-ignore
        navigator("(tabs)");
      } else {
        showErrorSnackbar(res.error);
      }
      setLoading(false);
    } catch (error: any) {
      showErrorSnackbar(error.message);
      setLoading(false);
    }
  };

  const wrongEmail = async () => {
    logout();
    router.replace("/signup");
  };
  return (
    <View style={{ flex: 1, padding: 24, paddingTop: 60 }}>
      <Image
        source={colorScheme == "dark" ? darkLogo : logo}
        style={{
          height: 70,
          resizeMode: "contain",
          width: colorScheme == "dark" ? 140 : 160,
          marginLeft: colorScheme == "dark" ? -10 : -20,
          alignSelf: "flex-start",
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
        Verify OTP
      </Text>
      <Text style={{ color: "green", marginBottom: 20 }}>
        OTP sent to {email}
      </Text>
      <Input
        type="number"
        label="OTP"
        value={otp}
        maxLength={6}
        onChange={(e) => setOtp(e)}
      />
      <Button
        label={loading ? "veriffying..." : "Verify"}
        disabled={loading}
        onPress={handleSubmit}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          marginTop: 10,
          justifyContent: "center",
        }}
      >
        <Text style={styles.text}>Wrong email?{"  "}</Text>
        <TouchableOpacity disabled={loading} onPress={wrongEmail}>
          <Text style={styles.linkText}>change</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyOtp;
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
