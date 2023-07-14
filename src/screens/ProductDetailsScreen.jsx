import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { addToBasket } from "../../features/basketSlice";

const ProductDetailsScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  // console.log("basket items: ", basketitems);
  // console.log("item details = ", route.params);
  const { id, image, name, description, price } = route.params;
  const [isLiked, setIsLiked] = useState(false);
  const [Added, setAdded] = useState(false);
  const { items } = useSelector((state) => state.basket);

  let convertedPrice = parseFloat(price);

  useFocusEffect(
    React.useCallback(() => {
      checkLiked();
    }, [])
  );

  const checkLiked = async () => {
    const storedValue = await AsyncStorage.getItem(`ItemInfo-${id}`);
    if (storedValue !== null) {
      setIsLiked(true);
    }
  };

  const AddToFavorite = async (value, prevLiked) => {
    setIsLiked(!prevLiked);

    const storedValue = await AsyncStorage.getItem(`ItemInfo-${id}`);
    if (storedValue !== null) {
      Toast.show({
        type: "error",
        text1: "item Alread in Storage !",
        visibilityTime: 3000,
        autoHide: true,
      });
    } else {
      try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(`ItemInfo-${id}`, jsonValue);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const addItemtoCart = () => {
    const found = items.find((item) => item.id === id);
    // console.log("found ? = ", found);
    if (found) {
      Toast.show({
        type: "error",
        text1: "Item Already Added to Cart !",
        visibilityTime: 3000,
        autoHide: true,
      });
    } else {
      dispatch(addToBasket({ id, image, name, convertedPrice }));
      setAdded(true);
      Toast.show({
        type: "success",
        text1: "Item Added to Cart",
        visibilityTime: 3000,
        autoHide: true,
        position: "bottom",
      });
    }
  };

  return (
    <View className="bg-white flex-1 justify-between">
      <Image
        source={{ uri: image }}
        className="h-auto w-full rounded-b-2xl flex-1"
        resizeMode="cover"
      />
      <BackButton />
      <View className="bg-blue-100 rounded-2xl mx-5 p-3 my-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl tracking-widest font-bold text-gray-700">
            {name}
          </Text>
          <Ionicons
            name={isLiked ? "heart-sharp" : "heart-outline"}
            size={24}
            color={isLiked ? "red" : "black"}
            onPress={() =>
              AddToFavorite({ id, image, name, convertedPrice }, isLiked)
            }
          />
        </View>
        <View className="m-2">
          <Text className="tracking-widest text-gray-700">{description}</Text>
        </View>
        <TouchableOpacity
          onPress={addItemtoCart}
          className="bg-indigo-500 mx-3 rounded-md p-3 flex-row justify-between mt-5 mb-1"
        >
          <View className="flex-row space-x-1 items-center">
            <Ionicons name="cart-sharp" size={30} color="white" />
            <Text className="text-white font-normal text-lg">Add to cart</Text>
          </View>

          <Text className="text-white font-extralight text-lg"> | </Text>
          <Text className="text-white font-normal text-lg">
            {" "}
            $ {convertedPrice}{" "}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;
