import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";

const Snackbar = ({ message, visible, type }: any) => {
  const [translateY] = useState(new Animated.Value(100));

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
        { transform: [{ translateY }], backgroundColor },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
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
    paddingVertical: 13,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  message: {
    flex: 1,
    color: "white",
  },
  dismiss: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Snackbar;
