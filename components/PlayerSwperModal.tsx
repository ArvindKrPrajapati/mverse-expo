import React, { useState, useEffect } from "react";
import { View, Dimensions, useColorScheme } from "react-native";
import Modal from "react-native-modal";
import LogoButton from "./LogoButton";
import { useSwiperModal } from "../Providers/SwiperModalProvider";
import MyPlayerPlayPage from "./MyPlayerPlayPage";
import Colors from "../constants/Colors";
import MversePlayer from "./Player/MversePlayer";
import { Text } from "./Themed";
import { usePathname } from "expo-router";

interface CustomModalProps {
  isVisible: boolean;
  closeModal: () => void;
  item: any;
}
const screenHeight = Dimensions.get("window").height;

const SwiperModal: React.FC<CustomModalProps> = ({
  isVisible,
  closeModal,
  item,
}) => {
  const [modalHeight, setModalHeight] = useState(
    Dimensions.get("window").height
  );
  const [isPortrait, setIsPortrait] = useState(true);
  const colorScheme = useColorScheme();
  const route = usePathname();

  const { hideSwiperModal } = useSwiperModal();
  const MIN_HEIGHT = 70;

  useEffect(() => {
    setModalHeight(screenHeight);
  }, [item]);

  const handleSwipeMove = (offset: number, obj: any) => {
    // if (obj.dy > 0) {
    //   // already modal in min height
    //   if (modalHeight == MIN_HEIGHT) return;
    //   const h = screenHeight * offset;
    //   setModalHeight(h);
    //   if (h <= screenHeight * 0.4) {
    //     setModalHeight(screenHeight);
    //   }
    // } else {
    //   // already modal in full height
    //   if (modalHeight == screenHeight) return;
    //   const uph = Math.abs(obj.dy);
    //   if (uph > MIN_HEIGHT) {
    //     setModalHeight(uph);
    //   }
    // }
  };

  const onSwipeComplete = (direction: any) => {
    if (direction.swipingDirection == "up") {
      setModalHeight(screenHeight);
    } else {
      setModalHeight(MIN_HEIGHT);
    }
  };

  const minimize = () => {
    setModalHeight(MIN_HEIGHT);
  };
  // useEffect(() => {
  //   Dimensions.addEventListener("change", (event) => {
  //     setModalHeight(event.window.height);
  //   });
  // }, []);
  const changeScreenOrientation = (_isPortrait: boolean) => {
    setIsPortrait(_isPortrait);
    // setModalHeight(Dimensions.get("window").height);
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
          hideSwiperModal();
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
      swipeDirection={["down", "up"]}
    >
      <View
        style={{
          height: isPortrait ? modalHeight : "100%",
          backgroundColor: Colors[colorScheme ?? "dark"].background,
          // backgroundColor: "red",
          marginBottom: modalHeight == MIN_HEIGHT && route == "/" ? 62 : 0,
          flexDirection: modalHeight == MIN_HEIGHT ? "row" : "column",
        }}
      >
        <View
          style={
            modalHeight == MIN_HEIGHT
              ? {
                  height: MIN_HEIGHT,
                  aspectRatio: 16 / 9,
                  flexDirection: "row",
                }
              : {}
          }
        >
          <MversePlayer
            url={item.link}
            poster={item.thumbnail}
            title={item.title}
            freezeControls={modalHeight == MIN_HEIGHT}
            minimizeVideo={minimize}
            changeScreenOrientation={changeScreenOrientation}
          />
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
        <MyPlayerPlayPage
          item={item}
          isVisible={
            modalHeight == MIN_HEIGHT ? false : isPortrait ? true : false
          }
        />
      </View>
    </Modal>
  );
};

export default SwiperModal;
