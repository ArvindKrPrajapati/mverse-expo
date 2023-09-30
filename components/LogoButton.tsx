import { Pressable, useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "./Themed";

const LogoButton = ({
  label,
  icon,
  onPress,
  textColor,
  style,
  iconSize = 20,
}: any) => {
  const colorScheme = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          padding: 10,
          borderRadius: 5,
          flexDirection: "row",
          gap: 10,
          marginTop: 7,
          backgroundColor: Colors[colorScheme ?? "light"].secondary,
          alignItems: "center",
        },
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          <MaterialCommunityIcons
            name={icon}
            size={iconSize}
            color={textColor || Colors[colorScheme ?? "light"].text}
            style={{ opacity: pressed ? 0.5 : 1 }}
          />
          {label ? (
            <Text
              style={{
                color: textColor || Colors[colorScheme ?? "light"].text,
                opacity: pressed ? 0.5 : 1,
              }}
            >
              {label}
            </Text>
          ) : null}
        </>
      )}
    </Pressable>
  );
};

export default LogoButton;
