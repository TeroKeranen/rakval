import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MoreTabButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={{ padding: 10 }} onPress={onPress}>
      <Ionicons name="ellipsis-horizontal" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default MoreTabButton;
