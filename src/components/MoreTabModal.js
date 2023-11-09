import React, { useState } from "react";
import { Modal, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChangeLanguage from "./ChangeLanguage";
import SignoutButton from "./SignoutButton";


const MoreTabModal = ({ isVisible, onClose, onLogout }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <SignoutButton onLogout={onLogout}/>
          {/* <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Text>Kirjaudu ulos</Text>
          </TouchableOpacity> */}
          <ChangeLanguage />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#f5f5f5" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    // justifyContent: "flex-end", // Jos haluaa modalin pohjalle
  },
  modalView: {
    
    backgroundColor: "white",
    borderTopLeftRadius: 20, // Pyöristetään vain yläkulmat
    borderTopRightRadius: 20,
    paddingVertical: 35,
    paddingHorizontal: 55,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButton: {
    marginBottom: 15,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 10,
    backgroundColor: "#5656e2",
    borderTopRightRadius: 20,
  },
});

export default MoreTabModal;
