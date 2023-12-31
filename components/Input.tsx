import React, { useState } from "react";
import {
  View,
  TextInput,
  useColorScheme,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "./Themed";

type Props = {
  type: string;
  onChange?: (text: string) => void;
  parentStyle?: StyleProp<ViewStyle>;
  labelStyle?: any;
  inputStyle?: StyleProp<TextStyle>;
  label?: string;
  value?: string;
  placeholder?: string;
  multiline?: boolean;
  editable?: boolean;
  maxLength?: number;
};

export default function Input({
  type,
  onChange,
  labelStyle,
  parentStyle,
  inputStyle,
  label,
  value,
  multiline,
  editable = true,
  maxLength,
  placeholder = "",
}: Props) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme == "dark";

  return (
    <View style={[{ marginBottom: 16, width: "100%" }, parentStyle]}>
      {label ? (
        <Text
          style={[
            { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}
      <View style={{ position: "relative" }}>
        {type === "textarea" ? (
          <TextInput
            underlineColorAndroid={"transparent"}
            editable={editable}
            value={value}
            onChangeText={onChange}
            multiline={multiline}
            maxLength={maxLength}
            placeholder={placeholder}
            placeholderTextColor="#eee"
            style={[
              {
                color: isDark ? "white" : "black",
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                fontSize: 16,
                paddingVertical: 8,
                paddingHorizontal: 12,
                marginBottom: 8,
              },
              inputStyle,
            ]}
          />
        ) : (
          <TextInput
            underlineColorAndroid={"transparent"}
            editable={editable}
            value={value}
            onChangeText={onChange}
            maxLength={maxLength}
            keyboardType={type == "number" ? "numeric" : "default"}
            secureTextEntry={type === "password" && !passwordVisible}
            style={[
              {
                color: isDark ? "white" : "black",
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                fontSize: 16,
                paddingVertical: 8,
                paddingHorizontal: 12,
                marginBottom: 8,
                paddingEnd: type == "password" ? 35 : 12,
              },
              inputStyle,
            ]}
          />
        )}
        {type === "password" ? (
          <View
            style={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: [{ translateY: -14 }],
              cursor: "pointer",
            }}
            onTouchEnd={() => {
              setPasswordVisible(!passwordVisible);
            }}
          >
            {passwordVisible ? (
              <MaterialCommunityIcons
                name="eye-off"
                color={"silver"}
                size={20}
              />
            ) : (
              <MaterialCommunityIcons name="eye" color={"silver"} size={20} />
            )}
          </View>
        ) : null}
      </View>
    </View>
  );
}
