import { View, Text, StyleProp, ViewStyle } from "react-native";
import React from "react";
import Slider from "@react-native-community/slider";
import Colors from "../../constants/Colors";

type Props = {
  duration: number;
  watched: number;
  onSliderValueChange: any;
  style?: StyleProp<ViewStyle>;
};

const MverseSlider = ({
  duration,
  watched,
  onSliderValueChange,
  style,
}: Props) => {
  return (
    <Slider
      style={style}
      minimumValue={0}
      value={duration && watched ? watched / duration : 0}
      onValueChange={onSliderValueChange}
      minimumTrackTintColor={Colors.dark.purple}
      maximumTrackTintColor="#eee"
      thumbTintColor={Colors.dark.purple}
    />
  );
};

export default MverseSlider;
