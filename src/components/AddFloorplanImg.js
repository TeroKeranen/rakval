import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useState } from "react";
import AddFloorplanImgModal from "./AddFloorplanImgModal";



const AddFloorplanImg = ({ imageUri, setImageUri, isVisible, onClose, onUpdate }) => {
    const { t } = useTranslation();
    const [imageModalVisible, setImageModalVisible] = useState(false);
    // const [imageUri, setImageUri] = useState(null);


      const handleModal = () => {
        setImageModalVisible(true);
      }
    return (
        <View>
            <TouchableOpacity onPress={handleModal} style={styles.button}>
                <Text style={{ color: "white" }}>avaa modal</Text>
              </TouchableOpacity>

              <AddFloorplanImgModal isVisible={imageModalVisible} onClose={() => setImageModalVisible(false)} onUpdate={onUpdate}  />
        </View>
        
        
    )
}

const styles = StyleSheet.create({
    button: {
        // width: "60%",
        // width: '30%',
        backgroundColor: "#812424",
        padding: 10,
        margin: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      },
})

export default AddFloorplanImg;