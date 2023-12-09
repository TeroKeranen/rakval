import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MoreTabButton = ({ onPress}) => {
  return (
    <TouchableOpacity style={{ padding: 10 }} onPress={onPress}>
      <Ionicons name="build" size={24} color="white" />
      
    </TouchableOpacity>
  );
};

export default MoreTabButton;
