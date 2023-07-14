import { TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className="absolute top-14 left-2"
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="arrow-back-circle-sharp" size={40} color="gray" />
    </TouchableOpacity>
  );
};

export default BackButton;
