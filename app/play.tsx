import React, { useEffect, useState } from "react";
import { Text, View } from "../components/Themed";
import { useRoute } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import { ScrollView } from "react-native-gesture-handler";

const orientationEnum = [
  "UNKNOWN",
  "PORTRAIT_UP",
  "PORTRAIT_DOWN",
  "LANDSCAPE_LEFT",
  "LANDSCAPE_RIGHT",
];
const PlayPage = () => {
  const route = useRoute();
  // @ts-ignore
  const item = route.params.item || null;
 

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            backgroundColor: "transparent",
            position: "absolute",
            zIndex: 100,
            width: "100%",
            aspectRatio: 16 / 9,
          }}
        >
          {isBuffering ? (
            <ActivityIndicator
              color="#eee"
              size={60}
              style={{ width: 60, alignSelf: "center", flex: 1 }}
            />
          ) : null}
        </View>
        <Video
          ref={videoRef}
          source={{ uri: item.link }}
          style={styles.video}
          useNativeControls
          //   shouldPlay={true}
          resizeMode={ResizeMode.CONTAIN}
          onLoadStart={onloadstart}
          onLoad={onLoad}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          onReadyForDisplay={onReadyForDisplay}
          usePoster={true}
          posterStyle={{ resizeMode: "stretch" }}
          posterSource={{ uri: item.thumbnail }}
        />
        <Button label={currentOrientation} onPress={changeOrientation} />
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit aliquam
          praesentium mollitia. Vel delectus iste, incidunt deserunt nisi
          cupiditate nemo ex consequatur omnis, ea nesciunt eveniet ipsum
          aliquid vero architecto. Magni excepturi tempora corrupti iste fuga
          aperiam quaerat dolore et esse repudiandae, animi eius beatae suscipit
          quos explicabo accusantium accusamus? Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Quasi laudantium expedita maiores
          provident accusantium similique reprehenderit aliquid, facere
          exercitationem placeat, esse fugiat consequatur omnis culpa, illo sint
          laborum modi corrupti in quaerat praesentium! Beatae amet autem earum
          harum, possimus deleniti quisquam voluptate tenetur deserunt
          repudiandae aliquam sed minima voluptatem rem dolores quo
          exercitationem consequuntur esse id, dolorum, magnam ipsa molestiae
          labore. Dolore, ratione, non nobis, quibusdam vitae harum mollitia
          quod voluptas et ipsa optio architecto natus corporis? Reprehenderit
          iure incidunt corporis exercitationem aspernatur saepe aperiam dolorem
          maiores, facere aliquam eaque perspiciatis natus asperiores cupiditate
          excepturi laborum debitis temporibus quam esse earum culpa voluptates?
          Possimus ducimus tempora animi, provident sunt quae aperiam illo
          assumenda similique quam esse eaque harum minus, culpa sequi nam
          suscipit a dolor quaerat at magni omnis, explicabo totam quasi! Hic
          voluptatem nesciunt totam qui dignissimos rerum voluptas, eaque
          obcaecati magni, eveniet sequi autem commodi fugiat veritatis deleniti
          dolorem iste voluptates expedita rem, iure aut beatae saepe soluta
          asperiores! Neque atque consequuntur alias nesciunt voluptatibus
          facere, eveniet expedita nulla perspiciatis repellendus eos iusto ea
          excepturi inventore voluptate odit culpa pariatur corporis cumque.
          Enim consequatur illo facere non laudantium officia nam rem corporis,
          voluptates, aliquam blanditiis consequuntur odit dolorem?
        </Text>
      </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
});
export default PlayPage;
