import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
const cartGif = require("../../assets/emptyCart.gif");
import { AntDesign } from "@expo/vector-icons";
import {
  clearBasket,
  removeFromBasket,
  updateQuantity,
} from "../../features/basketSlice";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import emailjs from "@emailjs/browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.basket);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // console.log(" show modal ? = ", showModal);

  const handleRemoveItem = (id, convertedPrice, quantity) => {
    dispatch(removeFromBasket({ id, convertedPrice, quantity }));
  };

  const renderItem = ({ item }) => (
    <View className="flex-row my-1 mx-2 border-b border-gray-100 pb-3">
      <View className="flex-row items-center">
        <Image
          source={{ uri: item.image }}
          className="h-16 w-16 object-contain mr-2 rounded-md"
        />
        <View>
          <Text>{item.name}</Text>
          <Text>$ {item.convertedPrice.toFixed(2)}</Text>
        </View>
      </View>
      <View className="flex-1 flex-row justify-end items-end space-x-3">
        <TouchableOpacity
          onPress={() =>
            handleUpdateQuantity(
              item.id,
              item.quantity - 1,
              item.convertedPrice
            )
          }
          disabled={item.quantity <= 1}
        >
          <AntDesign name="minuscircleo" size={25} color="black" />
        </TouchableOpacity>
        <Text className="text-xl">{item.quantity}</Text>
        <TouchableOpacity
          onPress={() =>
            handleUpdateQuantity(
              item.id,
              item.quantity + 1,
              item.convertedPrice
            )
          }
        >
          <AntDesign name="pluscircle" size={25} color="#757575" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            handleRemoveItem(item.id, item.convertedPrice, item.quantity)
          }
        >
          <AntDesign name="delete" size={25} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleUpdateQuantity = (id, quantity, convertedPrice) => {
    dispatch(updateQuantity({ id, quantity }));

    const item = items.find((item) => item.id === id);
    const prevQuantity = item.quantity;
    const newQuantity = quantity;
    const diffQuantity = newQuantity - prevQuantity;
    const itemPrice = convertedPrice;

    dispatch({
      type: "basket/updateTotalPrice",
      payload: itemPrice * diffQuantity,
    });
  };

  const handleSubmit = () => {
    if (!name || !phoneNumber || !address) {
      Toast.show({
        type: "error",
        text1: "Please fill all the fields",
        position: "top",
      });

      // setShowModal(false);
      return;
    }

    const cartItems = items.map((item) => {
      return `${item.quantity} x ${item.name} = $ ${item.convertedPrice.toFixed(
        2
      )}`;
    });

    const totalPriceFormated = totalPrice.toFixed(2);

    const templateParams = {
      name: name,
      phoneNumber: phoneNumber,
      address: address,
      items: cartItems.join("\n"),
      totalPrice: totalPriceFormated,
    };

    setShowModal(false);
    Toast.show({
      type: "info",
      text1: "Placing order ...",
      position: "top",
      visibilityTime: 2000,
    });

    emailjs
      .send(
        "service_40jf8p1",
        "template_m6r7sip",
        templateParams,
        "7kfuFvwNvmRaVyUh0"
      )
      .then(
        function (response) {
          Toast.show({
            type: "success",
            text1: "Order placed successfully",
            position: "top",
          });
          AddToPassedOrders(items);
          dispatch(clearBasket());
          navigation.reset({ index: 0, routes: [{ name: "Home" }] });
        },
        function (error) {
          console.log(
            "Order was not placed successfully, here's the error: ",
            error
          );
          Toast.show({
            type: "error",
            text1: "Order was not placed successfully",
            position: "top",
          });
        }
      );
  };

  const AddToPassedOrders = async (items) => {
    const date = new Date().toISOString().split("T")[0];
    const orderId = `Order-${date}|${Math.floor(Math.random() * 100000)}`;

    try {
      const jsonValue = JSON.stringify(items);
      await AsyncStorage.setItem(orderId, jsonValue);
    } catch (error) {
      console.log("AsyncStorage error: ", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center mx-3 my-1 border-b border-gray-300 pb-2">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="items-center"
        >
          <MaterialIcons name="arrow-back-ios" size={30} color="black" />
        </TouchableOpacity>
        <Text className="flex-1 text-center tracking-widest text-xl font-medium">
          Shopping Cart
        </Text>
      </View>

      <View className="min-h-[70%]">
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View className="">
              <Image source={cartGif} className=" my-5 h-96 w-96 -ml-5" />
              <Text className="text-lg font-semibold text-center">
                Your cart is empty 🤷‍♂️
              </Text>
            </View>
          }
        />
      </View>
      <View className="flex-1 mx-5 space-y-5">
        <Text className="font-semibold text-lg">
          Total : $ {totalPrice?.toFixed(2)}
        </Text>
        <TouchableOpacity
          className="bg-gray-600 py-3 rounded-3xl mx-10"
          onPress={() => {
            items?.length > 0
              ? setShowModal(true)
              : Toast.show({
                  type: "error",
                  text1: "Your cart is empty 🤷‍♂️",
                });
          }}
        >
          <Text className="text-white text-center text-base">
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        backdropOpacity={0.8}
        backdropColor="transparent"
        animationIn="zoomInDown"
        animationOut="zoomOutDown"
        animationInTiming={1000}
        animationOutTiming={300}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={2000}
        hideModalContentWhileAnimating={true}
        isVisible={showModal}
        onBackButtonPress={() => setShowModal(false)}
      >
        <View className="absolute bottom-0 left-0 right-0 bg-gray-200 rounded-t-3xl p-5">
          <View className="flex-row items-center justify-between mt-3">
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              className="absolute top-1 right-3"
            >
              <MaterialIcons name="close" size={24} color="gray" />
            </TouchableOpacity>
            <Text className="font-bold text-lg mb-5">Customer information</Text>
          </View>
          <View className="mb-3">
            <Text className="text-gray-800 text-sm">Name</Text>
            <TextInput
              className="border border-gray-300 p-2 mt-1 rounded bg-white"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View className="mb-3">
            <Text className="text-gray-800 text-sm">Phone number</Text>
            <TextInput
              className="border border-gray-300 p-2 mt-1 rounded bg-white"
              value={phoneNumber}
              keyboardType="numeric"
              onChangeText={(text) =>
                setPhoneNumber(text.replace(/[^0-9]/g, ""))
              }
              maxLength={10}
            />
          </View>
          <View className="mb-3">
            <Text className="text-gray-800 text-sm">Address</Text>
            <TextInput
              className="border border-gray-300 p-2 mt-1 rounded bg-white"
              value={address}
              onChangeText={setAddress}
            />
          </View>
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-gray-600 py-3 rounded-3xl mt-5"
          >
            <Text className="text-white text-center text-base">Checkout</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CartScreen;
