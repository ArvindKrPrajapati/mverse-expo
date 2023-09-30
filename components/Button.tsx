import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

type Props = {
  disabled?: boolean;
  label: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export default function Button({
  disabled = false,
  label,
  style,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      disabled={disabled}
      onPress={onPress}
    >
      <LinearGradient
        colors={["#4F46E5", "#643DFF", "#643DFF"]} // Gradient colors
        style={[styles.gradient, disabled && styles.disabled]}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    width: "100%",
    overflow: "hidden", // Clip the gradient to the button's border
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.4,
  },
});
