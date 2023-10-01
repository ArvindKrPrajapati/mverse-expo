import {
  Pressable,
  useColorScheme,
  ViewStyle,
  StyleProp,
  TextStyle,
} from "react-native";
import Colors from "../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "./Themed";

type Props = {
  label?: string;
  icon?: any;
  onPress?: any;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconSize?: number;
  numberOfLines?: number;
};
const LogoButton = ({
  label,
  icon,
  onPress,
  textColor,
  style,
  textStyle,
  iconSize = 20,
  numberOfLines,
}: Props) => {
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
          {icon ? (
            <MaterialCommunityIcons
              name={icon}
              size={iconSize}
              color={textColor || Colors[colorScheme ?? "light"].text}
              style={{ opacity: pressed ? 0.5 : 1 }}
            />
          ) : null}
          {label ? (
            <Text
              numberOfLines={numberOfLines}
              style={[
                {
                  color: textColor || Colors[colorScheme ?? "light"].text,
                  opacity: pressed ? 0.5 : 1,
                },
                textStyle,
              ]}
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
