import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Feather,
  SimpleLineIcons,
  MaterialIcons,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";
// import ProductsList from "../../ProductsList.json";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
const prehistoric = require("../../assets/prehistoricmen.gif");
import axios from "axios";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      FetchProducts();
    }, [])
  );

  useEffect(() => {
    // console.log("useEffect");
    setSelected("smartphone");
  }, []);

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Token 9161f265a6e47ac8b7b45407d09e74d8ceda5a11",
  };

  const FetchProducts = async () => {
    console.log("Fetching Products");
    await axios
      .get("https://electro-backend-udemy.onrender.com/api/products/", {
        headers,
      })
      .then((res) => {
        // console.log(res.data);
        setProducts(res.data);
        setNetworkError(false);
      })
      .catch((err) => {
        console.log(err);
        setNetworkError(true);
      });
  };

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }
  const renderItem = ({ item }) => {
    return (
      <View className="flex-row justify-between mb-5">
        {item[0] && (
          <View
            className="bg-white
           shadow-md shadow-black rounded-lg w-[180px]"
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProductDetails", {
                  id: item[0].id,
                  image: item[0].image,
                  name: item[0].name,
                  description: item[0].description,
                  price: item[0].price,
                })
              }
            >
              <Image
                source={{ uri: item[0].image }}
                className="h-64 w-full rounded-t-2xl"
                resizeMode="contain"
              />
              <View className="items-center my-2">
                <Text className="text-base">{item[0].name}</Text>
                <Text className="text-base text-indigo-500 font-semibold">
                  $ {item[0].price}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {item[1] && (
          <View
            className="bg-white
           shadow-md shadow-black rounded-lg w-[180px] "
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProductDetails", {
                  id: item[1].id,
                  image: item[1].image,
                  name: item[1].name,
                  description: item[1].description,
                  price: item[1].price,
                })
              }
            >
              <Image
                source={{ uri: item[1].image }}
                className="h-64 w-full rounded-t-2xl"
                resizeMode="contain"
              />
              <View className="items-center my-2">
                <Text className="text-base">{item[1].name}</Text>
                <Text className="text-base text-indigo-500 font-semibold">
                  $ {item[1].price}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    FetchProducts().then(() => setRefreshing(false));
  };

  return (
    <SafeAreaView className="mx-2 flex-1">
      <View>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 30,
            color: "gray",
          }}
        >
          ElectroMart
        </Text>
        <View className="flex-row space-x-5 mx-3 my-3">
          <View className="px-3 flex-row border border-x-gray-400 rounded-2xl flex-1 space-x-5 items-center">
            <Feather name="search" size={24} color="gray" />
            <TextInput
              placeholder="Search"
              className="py-2 flex-1"
              autoFocus={false}
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
            <TouchableOpacity>
              <Feather name="send" size={24} color="#6366f1" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="flex-row mt-2 justify-evenly my-2 mb-5">
        <TouchableOpacity
          className={`rounded-full h-16 w-16 items-center justify-center ${
            selected === "smartphone" ? "bg-indigo-500" : "bg-white"
          }`}
          onPress={() => setSelected("smartphone")}
        >
          <SimpleLineIcons
            name="screen-smartphone"
            size={35}
            color={selected === "smartphone" ? "white" : "black"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className={`rounded-full h-16 w-16 items-center justify-center ${
            selected === "computer" ? "bg-indigo-500" : "bg-white"
          }`}
          onPress={() => setSelected("computer")}
        >
          <MaterialIcons
            name="computer"
            size={24}
            color={selected === "computer" ? "white" : "black"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className={`rounded-full h-16 w-16 items-center justify-center ${
            selected === "game" ? "bg-indigo-500" : "bg-white"
          }`}
          onPress={() => setSelected("game")}
        >
          <Entypo
            name="game-controller"
            size={24}
            color={selected === "game" ? "white" : "black"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className={`rounded-full h-16 w-16 items-center justify-center ${
            selected === "tv" ? "bg-indigo-500" : "bg-white"
          }`}
          onPress={() => setSelected("tv")}
        >
          <FontAwesome
            name="tv"
            size={24}
            color={selected === "tv" ? "white" : "black"}
          />
        </TouchableOpacity>
      </View>
      <View>
        {networkError ? (
          <View className="items-center my-16 space-y-10">
            <Image source={prehistoric} className="h-64 w-[90%] rounded-2xl" />
            <View className="items-center flex-row space-x-3">
              <Ionicons name="wifi-outline" size={50} color="#6366f1" />
              <Text className="text-center text-2xl text-gray-500">
                Network Error
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={products
              .filter(
                (item) =>
                  item.category.name.toLowerCase() === selected &&
                  (item.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                    item.category.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()))
              )
              .reduce((result, item, index, array) => {
                if (index % 2 === 0) {
                  result.push(array.slice(index, index + 2));
                }
                return result;
              }, [])}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListFooterComponent={<View className="mb-56"></View>}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            ListEmptyComponent={
              <View>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 30,
                    color: "gray",
                  }}
                  className="text-center"
                >
                  No products found
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
