import { Pressable, useColorScheme, Modal, Text, View } from "react-native";

import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { Link, useRouter } from "expo-router";

const Menu = ({ style }: any) => {
  const colorScheme = useColorScheme();
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // const backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   () => {
    //     console.log("hello");
    //     setIsVisible(false);
    //     return true;
    //   }
    // );
    // return () => backHandler.remove();
  }, []);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        statusBarTranslucent={true}
      >
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
          }}
        >
          <Pressable
            onPress={() => setIsVisible(false)}
            style={{ flexGrow: 1 }}
          ></Pressable>
          <View style={{ padding: 20 }}>
            <View
              style={{
                backgroundColor: Colors[colorScheme ?? "light"].secondary,
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Pressable
                onPress={() => {
                  setIsVisible(false);
                  router.push("/settings");
                }}
                style={{
                  padding: 5,
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                {({ pressed }) => (
                  <>
                    <MaterialCommunityIcons
                      name="cog"
                      size={25}
                      color={Colors[colorScheme ?? "light"].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                    <Text
                      style={{
                        color: Colors[colorScheme ?? "light"].text,
                        opacity: pressed ? 0.5 : 1,
                      }}
                    >
                      Settings
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Pressable
        onPress={() => {
          setIsVisible(true);
        }}
      >
        {({ pressed }) => (
          <MaterialCommunityIcons
            name="dots-vertical"
            size={25}
            color={Colors[colorScheme ?? "light"].text}
            style={[{ marginRight: 15, opacity: pressed ? 0.5 : 1 }, style]}
          />
        )}
      </Pressable>
    </>
  );
};

export default Menu;
