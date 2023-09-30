import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Video, ResizeMode } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import Button from "../Button";
import Constants from "expo-constants";
import MversePlayerControls from "./MversePlayerControls";
import { useRouter } from "expo-router";

type Props = {
  url: string;
  title?: string;
  poster?: string;
};

const statusBarHeight = Constants.statusBarHeight;
const autoPlay = true;

const MversePlayer = ({ url, poster, title = url }: Props) => {
  const [isPortrait, setIsPortrait] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const videoRef = useRef<Video>(null);
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMute, setIsMute] = useState(false);
  const [duration, setDuration] = useState(0);
  const [watched, setWatched] = useState(0);

  const router = useRouter();

  const changeOrientation = useCallback(async () => {
    if (isPortrait) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
      );
      setIsPortrait(false);
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
      setIsPortrait(true);
    }
  }, [isPortrait]);

  const onLoadstart = () => {};

  const onLoad = (e: any) => {
    setDuration(e.durationMillis);
  };

  const onPlaybackStatusUpdate = (e: any) => {
    setIsBuffering(e.isBuffering);

    setWatched(e.positionMillis);
    if (e.isPlaying !== undefined) {
      setIsPlaying(e.isPlaying);
    }
  };

  const onReadyForDisplay = (e: any) => {};

  const playPause = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const minimize = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
    router.back();
  };

  const handleShowControl = () => {
    setShowControls(true);
  };

  const skipForward = async (seconds = 10) => {
    await skipVideo(watched + seconds * 1000);
  };
  const skipVideo = async (miliSeconds = 0) => {
    if (videoRef.current) {
      if (miliSeconds < duration) {
        videoRef.current.setPositionAsync(miliSeconds);
      }
    }
  };

  const onSliderValueChange = async (e: any) => {
    setWatched(Math.round(e * duration));
    await skipVideo(e * duration);
  };
  return (
    <SafeAreaView
      style={[
        { width: "100%" },
        isPortrait ? { aspectRatio: 16 / 10 } : { height: "100%" },
      ]}
    >
      <StatusBar hidden={!isPortrait} />
      <Pressable
        onPress={handleShowControl}
        onLongPress={() => skipForward(600)}
        style={{
          position: "absolute",
          zIndex: 5,
          width: "100%",
          height: "100%",
          marginTop: isPortrait ? statusBarHeight : 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isBuffering ? <ActivityIndicator size={50} color="#eee" /> : null}
      </Pressable>
      <MversePlayerControls
        containerStyle={{
          width: "100%",
          height: "100%",
          position: "absolute",
          marginTop: isPortrait ? statusBarHeight : 0,
          zIndex: 10,
        }}
        visible={showControls}
        setVisible={setShowControls}
        poster={poster}
        isPlaying={isPlaying}
        playPause={playPause}
        isPortrait={isPortrait}
        changeOrientation={changeOrientation}
        isMute={isMute}
        setIsMute={setIsMute}
        duration={duration}
        watched={watched}
        title={title}
        minimize={minimize}
        onSliderValueChange={onSliderValueChange}
      />
      <Video
        ref={videoRef}
        videoStyle={{ backgroundColor: "black" }}
        style={{ width: "100%", height: "100%" }}
        resizeMode={ResizeMode.CONTAIN}
        source={{
          uri: url,
        }}
        shouldPlay={autoPlay}
        usePoster={poster ? true : false}
        posterStyle={{ resizeMode: "stretch" }}
        posterSource={{ uri: poster }}
        onLoadStart={onLoadstart}
        onLoad={onLoad}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        onReadyForDisplay={onReadyForDisplay}
        isMuted={isMute}
      />
    </SafeAreaView>
  );
};

export default MversePlayer;
