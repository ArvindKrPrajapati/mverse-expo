import React, { useState, useEffect } from "react";
import { View, Dimensions, useColorScheme } from "react-native";
import Modal from "react-native-modal";
import LogoButton from "./LogoButton";
import { useSwiperModal } from "../Providers/SwiperModalProvider";
import MyPlayerPlayPage from "./MyPlayerPlayPage";
import Colors from "../constants/Colors";
import MversePlayer from "./Player/MversePlayer";
import { Text } from "./Themed";
import { usePathname, useRouter } from "expo-router";
import CardSkeleton from "./SkeletonLoader/CardSkeleton";
import { autoPlay, avoidRoute } from "../utils/common";

interface CustomModalProps {
  isVisible: boolean;
  closeModal: () => void;
  item: any;
}

const screenHeight = Dimensions.get("window").height;
// const screenHeight = 65;

const SwiperModal: React.FC<CustomModalProps> = ({
  isVisible,
  closeModal,
  item,
}) => {
  const [modalHeight, setModalHeight] = useState(
    Dimensions.get("window").height
  );
  const [isPortrait, setIsPortrait] = useState(true);
  const [changeToLandscape, setChangeToLandscape] = useState(false);
  const [changeToPortrait, setChangeToPortrait] = useState(false);
  const [itemChanged, setItemChanged] = useState(false);
  const [scaleUp, setScaleUp] = useState(1);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const colorScheme = useColorScheme();
  const route = usePathname();
  const router = useRouter();

  const { hideSwiperModal } = useSwiperModal();
  const MIN_HEIGHT = 65;

  useEffect(() => {
    setItemChanged(true);
    const tm = setTimeout(() => {
      setModalHeight(screenHeight);
      setItemChanged(false);
    }, 50);

    return () => clearTimeout(tm);
  }, [item]);

  const handleSwipeMove = (offset: number, obj: any) => {
    if (obj.dy > 0) {
      if (!isPortrait) {
        setScaleUp(0.9);
      }

      // already modal in min height
      if (modalHeight == MIN_HEIGHT) return;
      const h = screenHeight * offset;
      setModalHeight(h);
    } else {
      // already modal in full height
      if (modalHeight == screenHeight) {
        setScaleUp(1.2);
      }
      if (modalHeight >= screenHeight) return;

      const uph = Math.abs(obj.dy);
      if (uph > MIN_HEIGHT) {
        setModalHeight(uph);
      }
    }
  };
  const swipeCancel = (evt: any) => {
    setScaleUp(1);
    if (!isPortrait) return;
    if (evt.dy > 0) {
      if ((modalHeight / screenHeight) * 100 > 40) {
        setModalHeight(screenHeight);
      }
    } else {
      if ((modalHeight / screenHeight) * 100 < 40) {
        setModalHeight(MIN_HEIGHT);
      }
    }
  };
  const onSwipeComplete = (direction: any) => {
    if (direction.swipingDirection == "up") {
      if (modalHeight == screenHeight) {
        setChangeToLandscape(true);
      }
      setModalHeight(screenHeight);
    } else {
      if (isPortrait) {
        setModalHeight(MIN_HEIGHT);
      } else {
        setChangeToPortrait(true);
        setModalHeight(screenHeight);
      }
    }
  };

  const minimize = () => {
    setModalHeight(MIN_HEIGHT);
  };

  const changeScreenOrientation = (_isPortrait: boolean) => {
    setScaleUp(1);
    setIsPortrait(_isPortrait);
    setChangeToLandscape(false);
    setChangeToPortrait(false);
  };

  const onVideoStateChange = (_isPlaying: boolean) => {
    setIsPlaying(_isPlaying);
  };

  return (
    <Modal
      isVisible={isVisible}
      hasBackdrop={false}
      coverScreen={false}
      useNativeDriver={true}
      onModalWillShow={() => {
        setModalHeight(screenHeight);
      }}
      onBackButtonPress={() => {
        if (modalHeight == MIN_HEIGHT) {
          if (route == "/") {
            hideSwiperModal();
          } else {
            router.back();
          }
        } else {
          setModalHeight(MIN_HEIGHT);
        }
      }}
      style={{ margin: 0, justifyContent: "flex-end" }}
      onSwipeMove={(direction, obj) => {
        handleSwipeMove(direction, obj);
      }}
      onSwipeComplete={(x) => {
        onSwipeComplete(x);
      }}
      onSwipeCancel={swipeCancel}
      swipeDirection={["down", "up"]}
    >
      <View
        style={{
          height: isPortrait ? modalHeight : "100%",
          backgroundColor: Colors[colorScheme ?? "dark"].background,
          // backgroundColor: "red",
          marginBottom:
            modalHeight == MIN_HEIGHT && avoidRoute.includes(route) ? 62 : 0,
          flexDirection: modalHeight == MIN_HEIGHT ? "row" : "column",
        }}
      >
        <View
          style={[
            modalHeight == MIN_HEIGHT
              ? {
                  height: MIN_HEIGHT,
                  aspectRatio: 16 / 9,
                  flexDirection: "row",
                }
              : { transform: [{ scale: scaleUp }] },
          ]}
        >
          {itemChanged ? (
            <View style={{ backgroundColor: "black" }}></View>
          ) : (
            <MversePlayer
              url={item.link}
              poster={item.thumbnail}
              title={item.title}
              freezeControls={modalHeight == MIN_HEIGHT}
              minimizeVideo={minimize}
              changeScreenOrientation={changeScreenOrientation}
              landscape={changeToLandscape}
              portrait={changeToPortrait}
              onVideoStateChange={onVideoStateChange}
              isPlayingVideo={isPlaying}
            />
          )}
        </View>
        {modalHeight == MIN_HEIGHT ? (
          <View
            style={{
              padding: 10,
              paddingHorizontal: 15,
              flexDirection: "row",
              flex: 1,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1}>{item.title}</Text>
              <Text numberOfLines={1} style={{ fontWeight: "500" }}>
                {item.by.channelName}
              </Text>
            </View>
            <LogoButton
              icon={isPlaying ? "pause" : "play"}
              iconSize={25}
              onPress={() => {
                setIsPlaying(!isPlaying);
              }}
              style={{
                backgroundColor: "transparent",
                height: "100%",
                marginTop: 0,
              }}
            />
            <LogoButton
              icon="close"
              iconSize={25}
              onPress={hideSwiperModal}
              style={{
                backgroundColor: "transparent",
                height: "100%",
                marginTop: 0,
              }}
            />
          </View>
        ) : null}
        {itemChanged ? (
          <CardSkeleton horizontal={false} size={3} />
        ) : (
          <MyPlayerPlayPage
            item={item}
            isVisible={
              modalHeight == MIN_HEIGHT ? false : isPortrait ? true : false
            }
          />
        )}
      </View>
    </Modal>
  );
};

export default SwiperModal;
