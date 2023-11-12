import {
  View,
  Text,
  Image,
  useColorScheme,
  StyleProp,
  ImageStyle,
  FlatList,
} from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { TouchableRipple } from "react-native-paper";
import { useNavigation } from "expo-router";
type Props = {
  images: any;
  width?: any;
  square?: boolean;
  clickable?: boolean;
};
const ShowImages = ({
  images,
  width,
  square = false,
  clickable = false,
}: Props) => {
  const style: any = {
    height: 300,
    width: "100%",
  };
  if (images.length == 2) {
    style["width"] = "50%";
    style["height"] = 200;
  }

  if (square) {
    style["aspectRatio"] = 1 / 1;
  }

  return (
    <FlatList
      style={{ marginVertical: 8 }}
      contentContainerStyle={{ width }}
      scrollEnabled={false}
      columnWrapperStyle={{
        borderRadius: 10,
        overflow: "hidden",
        gap: 2,
      }}
      data={images}
      renderItem={({ item }) => (
        <ImageContainer image={item} style={style} clickable={clickable} />
      )}
      numColumns={2}
    />
  );
};

export default ShowImages;
type imageProps = {
  image: any;
  style?: StyleProp<ImageStyle>;
  clickable?: boolean;
};

const ImageContainer = ({ image, style, clickable }: imageProps) => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const obj = {
    uri: image.uri || image,
  };
  return (
    <TouchableRipple
      style={[
        {
          backgroundColor: Colors[colorScheme ?? "dark"].secondary,
        },
        style,
      ]}
      onPress={() => {
        if (clickable) {
          // @ts-ignore
          navigation.navigate("view-image", { item: image });
        }
      }}
      background={{
        foreground: true,
        color: "black",
      }}
      //   rippleColor={"rgba(0,30,0,0.1)"}
    >
      <Image
        source={{ uri: obj.uri }}
        style={[
          {
            width: "100%",
            height: "100%",
            backgroundColor: Colors[colorScheme ?? "dark"].secondary,
          },
        ]}
        resizeMode="cover"
      />
    </TouchableRipple>
  );
};
