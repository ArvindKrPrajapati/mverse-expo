import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

type Props = {
  user: {
    name?: string;
    dp?: string;
    channelName?: string;
  };
  size: number;
  style?: any; // Use the 'style' prop instead of 'className'
};

const GenerateUserPicture = ({ user, style, size = 25 }: Props) => {
  if (user?.dp) {
    return (
      <Image
        source={{ uri: user.dp }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: 100 },
          style,
        ]} // Use the 'style' prop directly
      />
    );
  }

  if (user?.channelName || user?.name) {
    const initials = user?.channelName
      ? user.channelName[0]
      : user?.name
      ? user.name[0]
      : "";

    return (
      <View style={[styles.placeholder, { width: size, height: size }, style]}>
        {/* Use the 'style' prop directly */}
        <Text style={styles.initials}>{initials}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.placeholder, { width: size, height: size }, style]} />
  ); // Use the 'style' prop directly
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    aspectRatio: 1,
  },
  placeholder: {
    borderRadius: 100,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
});

export default GenerateUserPicture;
