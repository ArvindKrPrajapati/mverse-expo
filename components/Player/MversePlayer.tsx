import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Animated,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Video, ResizeMode } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import Button from "../Button";
import Constants from "expo-constants";
import MversePlayerControls from "./MversePlayerControls";
import { useRouter } from "expo-router";
import { useSnackbar } from "../../Providers/SnackbarProvider";
import {
  Gesture,
  GestureDetector,
  HandlerStateChangeEvent,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
  State,
} from "react-native-gesture-handler";
import MverseSlider from "./MverseSlider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  url: string;
  title?: string;
  poster?: string;
};

const statusBarHeight = Constants.statusBarHeight;
const autoPlay = true;

const MversePlayer = ({ url, poster, title = url }: Props) => {
  const [skip, setSkip] = useState({ forward: 0, backward: 0 });
  // ######### gesture ##########
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(async (event) => {
      //get the tap position on X
      if (!videoRef) return;
      const touchX = event.absoluteX;
      let mid = Dimensions.get("screen").width / 2;
      const seconds = 10;
      //if tap position is before the mid point, set video back by 10s
      if (touchX < mid) {
        setSkip({ forward: 0, backward: skip.backward + seconds });
        await skipVideo(watched + seconds * -1000);
      }
      //if tap position is before the mid point, set video forward by 10s
      else {
        setSkip({ forward: skip.forward + seconds, backward: 0 });
        await skipVideo(watched + seconds * 1000);
      }
    });

  const singleTap = Gesture.Tap().onStart((event) => {
    handleShowControl();
  });

  // ########## end ###############
  const [isPortrait, setIsPortrait] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const videoRef = useRef<Video>(null);
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMute, setIsMute] = useState(false);
  const [duration, setDuration] = useState(0);
  const [watched, setWatched] = useState(0);
  const [videoMode, setVideoMode] = useState<any>("CONTAIN");
  const router = useRouter();
  const { showErrorSnackbar } = useSnackbar();
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
  const onError = (e: any) => {
    showErrorSnackbar(e || "Something went wrong");
  };

  const onPlaybackStatusUpdate = (e: any) => {
    setIsBuffering(e.isBuffering);

    setWatched(e.positionMillis);
    if (e.isPlaying !== undefined) {
      if (!e.isBuffering) {
        setIsPlaying(e.isPlaying);
      }
    }
  };

  useEffect(() => {
    const tm = setTimeout(() => {
      setSkip({ forward: 0, backward: 0 });
    }, 400);
    return () => clearTimeout(tm);
  }, [skip]);
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

  // ############### pinch handler ###############
  const pinchScale = useRef(new Animated.Value(1));
  const baseScale = useRef(1);

  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale.current } }],
    { useNativeDriver: false }
  );

  const onPinchStateChange = (
    event: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const distance = Math.round(event.nativeEvent.scale);
      if (distance >= 1) {
        switch (videoMode) {
          case "CONTAIN":
            setVideoMode("STRETCH");
            break;
          case "STRETCH":
            setVideoMode("COVER");
            break;
          case "COVER":
            setVideoMode("CONTAIN");
            break;
          default:
            setVideoMode("CONTAIN");
            break;
        }
      } else {
        setVideoMode("CONTAIN");
      }
    }
  };
  return (
    <SafeAreaView
      style={[
        { width: "100%", zIndex: 20 },
        isPortrait ? { aspectRatio: 16 / 10 } : { height: "100%" },
      ]}
    >
      <StatusBar hidden={!isPortrait} />
      <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap)}>
        <PinchGestureHandler
          onGestureEvent={onPinchEvent}
          onHandlerStateChange={onPinchStateChange}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              zIndex: 5,
              marginTop: isPortrait ? statusBarHeight : 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "80%",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 40,
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  alignItems: "center",
                }}
              >
                {skip.backward ? (
                  <>
                    <MaterialCommunityIcons
                      name="rewind"
                      color="#eee"
                      size={30}
                    />
                    <Text style={{ color: "#eee", fontWeight: "900" }}>
                      {skip.backward}
                    </Text>
                  </>
                ) : null}
              </View>
              <View style={{ width: 50 }}>
                {isBuffering ? (
                  <ActivityIndicator size={50} color="#eee" />
                ) : null}
              </View>
              <View
                style={{
                  width: 40,
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                  alignItems: "center",
                }}
              >
                {skip.forward ? (
                  <>
                    <Text style={{ color: "#eee", fontWeight: "900" }}>
                      {skip.forward}
                    </Text>

                    <MaterialCommunityIcons
                      name="fast-forward"
                      color="#eee"
                      size={30}
                    />
                  </>
                ) : null}
              </View>
            </View>
          </View>
        </PinchGestureHandler>
      </GestureDetector>
      {isPortrait && !showControls ? (
        <MverseSlider
          duration={duration}
          watched={watched}
          onSliderValueChange={onSliderValueChange}
          style={{
            position: "absolute",
            bottom: -10,
            zIndex: 9,
            left: -16,
            width: Dimensions.get("window").width + 31,
          }}
        />
      ) : null}
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
        // @ts-ignore
        resizeMode={ResizeMode[videoMode]}
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
        onError={onError}
        isMuted={isMute}
      />
    </SafeAreaView>
  );
};

export default MversePlayer;
