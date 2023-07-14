import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoriteItemsScreen = () => {
  const [FavoriteItems, setFavoriteItems] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      FavoriteItemsList();
    }, [])
  );

  const FavoriteItemsList = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const itemKeys = keys.filter((key) => key.startsWith("ItemInfo-"));
      const items = await AsyncStorage.multiGet(itemKeys);

      setFavoriteItems(
        items.map((item) => {
          const itemId = item[0].split("-")[1];
          return { id: itemId, ...JSON.parse(item[1]) };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavoriteItem = async (itemId) => {
    try {
      await AsyncStorage.removeItem(`ItemInfo-${itemId}`);
      setFavoriteItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <>
        <View className="flex-row my-3 items-center mx-3">
          <Image
            source={{ uri: item.image }}
            className="h-20 w-20 rounded-xl"
          />
          <View className="flex-1 mx-3">
            <Text className="font-semibold">{item.name}</Text>
            <Text className="text-gray-500">$ {item.price}</Text>
          </View>
          <TouchableOpacity onPress={() => removeFavoriteItem(item.id)}>
            <Ionicons name="trash-outline" size={30} color="red" />
          </TouchableOpacity>
        </View>
        <View className="border-b border-gray-300 mx-8" />
      </>
    );
  };

  return (
    <SafeAreaView>
      <View
        className="flex-row items-center
      my-1 mx-3 border-b border-gray-300 pb-2"
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={30} color="black" />
        </TouchableOpacity>
        <Text className="flex-1 text-center tracking-widest text-xl font-medium">
          Favorite Items
        </Text>
      </View>
      <View>
        <FlatList
          data={FavoriteItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default FavoriteItemsScreen;
