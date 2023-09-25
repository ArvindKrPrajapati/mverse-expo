import React from "react";
import { useGlobalSearchParams } from "expo-router";
import PlayList from "../PlayList";

const PlaylistTab = () => {
  const glob = useGlobalSearchParams();
  const username = glob.username;

  return <PlayList username={username} />;
};

export default PlaylistTab;
