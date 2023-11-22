
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import DownloadScreen from './DownloadScreen';

import { FLOORPLAN_PHOTO_URL } from "@env";
import { useState } from 'react';
const MarkerinfoModal = ({isVisible, onClose, marker, onEdit, onDelete, isModalMarkerImage}) => {
    const { t } = useTranslation();
    const [isLoading, SetIsLoading] = useState(false);
    
          

    return (
        <Modal
        animationType="slide"
        
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalView}>
          <View style={styles.delBtnContainer}>
            <Text style={{ fontSize: 16 }}>{marker ? marker.created : ""}</Text>
            <Text style={{ fontSize: 16 }}>
              {t("floorplanscreen-markerModal-creator")}: {marker ? marker.creator : ""}
            </Text>
            <TouchableOpacity onPress={onDelete}>
              <Ionicons name="trash" size={20} />
            </TouchableOpacity>
          </View>

          
          <ScrollView contentContainerStyle={styles.scrollViewStyle}>
            {/* <View style={styles.modalInfo}> */}
              <TouchableOpacity style={styles.modalButton} onPress={onEdit}>
                <Text>Muokkaa</Text>
              </TouchableOpacity>
              


              <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>{t("floorplanscreen-markerModal-info")}</Text>
              <Text style={{ fontSize: 16 }}>{marker ? marker.info : ""}</Text>

              {isModalMarkerImage && (
                
              <Image resizeMode={'stretch'} width={300} height={300} source={{ uri: `${FLOORPLAN_PHOTO_URL}${isModalMarkerImage}` }} style={styles.image} />
              )}
              </ScrollView>
              
            {/* </View> */}

          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text>{t("floorplanscreen-close-marker")}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        
        // padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      delBtnContainer: {
        width: "100%",
        backgroundColor: "#cea229",
        padding: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
      },
      scrollViewStyle: {
        flexGrow: 1, // Tämä auttaa varmistamaan, että sisältö näkyy oikein
        // justifyContent: 'flex-start', // Aseta sisältö alkamaan ylhäältä
        width: '90%',
        
      },
      modalInfo: {
        flex: 4,
        width: "100%",
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
      },
      modalButton: {
        backgroundColor: "#dddddd",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        width: "30%",
        alignItems: "center",
        alignSelf:'center'
      },
      image: {
        flex: 1,
        // height: 300,
        // width: 300,
        
        marginTop: 20,
        marginBottom: 40,
        borderRadius: 10,
        // resizeMode: 'contain'
      },
    

})

export default MarkerinfoModal;