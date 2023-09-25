import React, { useState } from "react";
import { ActivityIndicator, Pressable, useColorScheme } from "react-native";
import { Text, View } from "../components/Themed";
import Constants from "expo-constants";
import Colors from "../constants/Colors";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { mverseGet } from "../service/api.service";
import { useSnackbar } from "../Providers/SnackbarProvider";

const SearchModal = () => {
  const glob=useGlobalSearchParams()
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState<any>(glob.search || "");

  const colorScheme = useColorScheme();
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackbar();

  const handleChange = async (text: string) => {
    setSearchText(text);
    if (text.length < 1) setData([]);
    if (text.length < 3) return;
    try {
      setData([]);
      setLoading(true);
      const res = await mverseGet("/api/search?name=" + text.trim());
      if (res.success) {
        setData(res.data);
      } else {
        showErrorSnackbar(res.error);
      }
    } catch (error: any) {
      showErrorSnackbar(error.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const goToSearch=(text:any)=>{
    router.replace(`/search-page?search=${text}`)
  }
  return (
    <>
      <View
        style={{
          paddingTop: Constants.statusBarHeight + 15,
          paddingBottom: 15,
          paddingHorizontal: 15,
          borderWidth: 1,
          borderBottomColor: Colors[colorScheme ?? "light"].secondary,
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="search"
          value={searchText}
          onChangeText={handleChange}
          placeholderTextColor={Colors[colorScheme ?? "light"].secondaryText}
          autoFocus={true}
          style={{
            flex: 1,
            fontSize: 13,
            paddingHorizontal: 10,
            color: Colors[colorScheme ?? "light"].text,
          }}
        />
      </View>
      {/* display */}
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        {searchText ? (
          <Pressable
            style={{
              padding: 7,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
            onPress={()=>goToSearch(searchText)}
          >
            {loading ? (
              <ActivityIndicator
                size={14}
                color={Colors[colorScheme ?? "light"].secondaryText}
              />
            ) : (
              <FontAwesome
                name="search"
                size={14}
                color={Colors[colorScheme ?? "light"].text}
              />
            )}
            <Text>{searchText}</Text>
          </Pressable>
        ) : null}
        {data.map((item: any, index) => (
          <Pressable
            key={index}
            style={{
              padding: 7,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
            onPress={()=>goToSearch(item.title)}
          >
            <FontAwesome
                name="search"
                size={14}
                color={Colors[colorScheme ?? "light"].text}
              />
            <Text>{item.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
};

export default SearchModal;
