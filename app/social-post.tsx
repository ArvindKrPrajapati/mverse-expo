import { View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import NotFound from "../components/NotFound";
import AllPosts from "../components/Social/AllPosts";

const SinglePostPage = () => {
  const localParams = useLocalSearchParams();
  const id: any = localParams.id;
  if (!id) {
    return <NotFound message="This post is not available" />;
  }
  return <AllPosts id={id} />;
};

export default SinglePostPage;
