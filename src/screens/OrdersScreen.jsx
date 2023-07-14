import { View, Text, FlatList, Image } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const OrdersScreen = () => {
  const [orders, setOrders] = useState();

  const loadOrders = async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    const orderKeys = allKeys.filter((key) => key.startsWith("Order"));
    const orderData = await AsyncStorage.multiGet(orderKeys);

    const parsedOrders = {};

    orderData.forEach((data) => {
      const key = data[0];
      const value = JSON.parse(data[1]);
      const baseKey = key.split("|")[0];

      if (parsedOrders[baseKey]) {
        parsedOrders[baseKey].push(value);
      } else {
        parsedOrders[baseKey] = [value];
      }
    });

    const orders = Object.keys(parsedOrders).map((key) => {
      return { key, value: parsedOrders[key] };
    });

    setOrders(orders);
  };

  // console.log(JSON.stringify(orders));

  useFocusEffect(
    React.useCallback(() => {
      loadOrders();
    }, [])
  );

  const renderItem = ({ item }) => {
    const orders = item.value;
    return (
      <View className="border-b border-gray-300 mx-2">
        <Text className="font-medium text-lg text-center">{item.key}</Text>
        {orders.map((order, orderIndex) => (
          <View key={orderIndex}>
            {order.map((product, productIndex) => (
              <View key={productIndex} className="flex-row my-3 items-center">
                <Image
                  source={{ uri: product.image }}
                  className="h-16 w-16 object-contain mr-2 rounded-md"
                />
                <Text className="font-extrabold">{product.quantity} x </Text>
                <Text className="text-gray-700 font-medium">
                  {product.name} ={" "}
                </Text>
                <Text className="font-extrabold">
                  $ {product.convertedPrice}{" "}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="mx-3">
      <View className="items-center mx-3 my-1 border-b border-gray-300 pb-2">
        <Text className="text-center tracking-widest text-xl font-medium">
          Orders
        </Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default OrdersScreen;
