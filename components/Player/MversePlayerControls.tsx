import React, { useCallback, useEffect, useState } from "react";
import {
  StyleProp,
  View,
  ViewStyle,
  Text,
  Pressable,
  Animated,
  ImageBackground,
} from "react-native";
import LogoButton from "../LogoButton";
import { formatTime } from "../../utils/common";
import Slider from "@react-native-community/slider";
import Colors from "../../constants/Colors";
import MverseSlider from "./MverseSlider";

const transparent = require("../../assets/images/transparent.png");

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  visible?: boolean;
  poster?: string;
  isPlaying?: boolean;
  isPortrait?: boolean;
  isMute?: boolean;
  duration?: number;
  watched?: number;
  title?: string;
  minimize?: () => void;
  setVisible?: (state: boolean) => void;
  playPause?: () => void;
  changeOrientation?: () => void;
  setIsMute?: (state: boolean) => void;
  onSliderValueChange?: (e: any) => void;
};
const MversePlayerControls = ({
  containerStyle,
  visible = true,
  poster = "",
  setVisible,
  isPlaying = true,
  playPause,
  isPortrait = true,
  changeOrientation,
  isMute = false,
  setIsMute,
  duration = 0,
  watched = 0,
  title = "",
  minimize,
  onSliderValueChange,
}: Props) => {
  const translateY = new Animated.Value(100);

  const toggleAnimation = useCallback(() => {
    const endValue = visible ? 0 : 100;
    Animated.timing(translateY, {
      toValue: endValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  useEffect(() => {
    toggleAnimation();
  }, [visible]);

  const hideControls = useCallback(() => {
    setVisible ? setVisible(false) : null;
  }, [visible]);

  useEffect(() => {
    if (visible && setVisible && isPlaying) {
      const tm = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(tm);
    }
  }, [visible, isPlaying]);

  if (!visible) {
    return null;
  }
  return (
    <Pressable
      style={[
        {
          justifyContent: "space-between",
          backgroundColor: "rgba(0,0,0,0.3)",
        },
        containerStyle,
      ]}
      onPress={hideControls}
    >
      {/* header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 5,
          paddingHorizontal: 10,
          gap: 10,
        }}
      >
        <LogoButton
          onPress={minimize ? minimize : null}
          icon="chevron-down"
          iconSize={25}
          style={{ backgroundColor: "transparent", padding: 0 }}
          textColor="white"
        />
        <Text
          style={{ color: "#eee", flex: 1, fontWeight: "600" }}
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
      <Pressable onPress={() => null}>
        <Animated.View
          style={{
            height: 100,
            width: "80%",
            marginBottom: 10,
            backgroundColor: "rgba(0,0,0,0.5)",
            alignSelf: "center",
            borderRadius: 8,
            overflow: "hidden",
            transform: [{ translateY }],
          }}
        >
          {/* <ImageBackground
            source={poster ? { uri: poster } : transparent}
            style={{ width: "100%", height: "100%" }}
            blurRadius={30}
          > */}
          <View
            style={{
              paddingHorizontal: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {/* start */}
            <LogoButton
              onPress={() => (setIsMute ? setIsMute(!isMute) : null)}
              icon={isMute ? "volume-off" : "volume-high"}
              style={{ backgroundColor: "transparent" }}
              textColor="white"
            />
            {/*  middle controls */}
            <View style={{ flexDirection: "row" }}>
              <LogoButton
                icon="skip-previous"
                iconSize={25}
                style={{ backgroundColor: "transparent" }}
                textColor="white"
              />
              <LogoButton
                onPress={playPause ? playPause : null}
                icon={isPlaying ? "pause" : "play"}
                iconSize={50}
                style={{ backgroundColor: "transparent", padding: 3 }}
                textColor="white"
              />
              <LogoButton
                icon="skip-next"
                iconSize={25}
                style={{ backgroundColor: "transparent" }}
                textColor="white"
              />
            </View>
            {/* last */}
            <LogoButton
              onPress={changeOrientation ? changeOrientation : null}
              icon={isPortrait ? "fullscreen" : "fullscreen-exit"}
              style={{ backgroundColor: "transparent" }}
              textColor="white"
            />
          </View>
          {/* timers */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ color: "#eee", fontSize: 12 }}>
              {formatTime(watched / 1000)}
            </Text>
            <Text style={{ color: "#eee", fontSize: 12 }}>
              {formatTime(duration / 1000)}
            </Text>
          </View>
          {/* slider */}
          <MverseSlider
            duration={duration}
            watched={watched}
            onSliderValueChange={onSliderValueChange}
          />
          {/* </ImageBackground> */}
        </Animated.View>
      </Pressable>
    </Pressable>
  );
};

export default MversePlayerControls;
