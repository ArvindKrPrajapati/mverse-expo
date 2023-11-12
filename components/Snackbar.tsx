import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import LogoButton from "./LogoButton";
import { usePathname } from "expo-router";
import { avoidRoute } from "../utils/common";

const Snackbar = ({ message, visible, type, setVisible, bottom = 15 }: any) => {
  const [translateY] = useState(new Animated.Value(100));
  const pathname = usePathname();

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const hideSnackbar = () => {
    Animated.timing(translateY, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  // Define the background color based on the 'type' prop
  const backgroundColor =
    type === "error"
      ? "red"
      : type === "success"
      ? "green"
      : "rgba(20, 20, 20, 0.8)";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          bottom: avoidRoute.includes(pathname) ? 65 : 15,
        },
      ]}
    >
      <LogoButton
        style={{
          marginTop: 0,
          flex: 1,
          padding: 15,
          paddingHorizontal: 18,
          backgroundColor: backgroundColor,
          justifyContent: "space-between",
        }}
        textColor="white"
        onPress={() => setVisible(false)}
        rightIcon="close"
        iconSize={15}
        label={message}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
    borderRadius: 10,
  },
});

export default Snackbar;
