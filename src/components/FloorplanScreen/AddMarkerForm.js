import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import ImagePicker from "../ImagePicker";

const AddMarkerForm = ({handleSaveMarker,closeMarker, showMarker,setPickedImageUri, markerInfo, setMarkerInfo}) => {
    const { t } = useTranslation();

    const [moveInfo, setMoveInfo] = useState(false); 
    

    // kun lisätään markeri niin tällä voidaan liikuttaa tietojensyöttämis lomakkeen ylös tai alas
    const moveInfobox = () => {

    setMoveInfo(prevMoveInfo => !prevMoveInfo);

    }

   

        // Käytetään tätä marker formissa jotta voimme liikuttaa sitä ylös tai alas
    const addMarkerContainerStyle = {
        position: "absolute",
        bottom: moveInfo ? null : 20,
        top: moveInfo ? 0 : null,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: "#f7f8f7",
        justifyContent: "center",
        alignItems: "center",
    
    };


    return (
        <>
        
        <View style={addMarkerContainerStyle}>
          {/* jos moveInfo === true, niin markerin lisäys formi on ylhäällä */}
          {moveInfo ? (
            <TouchableOpacity onPress={moveInfobox}>
              <Text>{t("floorplanscreen-move-down")}</Text>
            </TouchableOpacity>
          ) : (
            // Jos moveInfo === false, niin markerin lisäys formi on alhaalla
            <TouchableOpacity onPress={moveInfobox}>
              <Text>{t("floorplanscreen-move-up")}</Text>
            </TouchableOpacity>
          )}

          <TextInput style={styles.textInputStyle} onChangeText={setMarkerInfo} value={markerInfo} placeholder={t("floorplanscreen-marker-textinput")} />
          
          {/*  Kun showMarker === true, niin lisätään imagePicker näkyviin. showMarker vaihtuu true arvoon silloin kun painamme markerin kuvaan  */}

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity onPress={handleSaveMarker} style={styles.addMarkerButton}>
              <Text style={styles.addMarkerButtonText}>{t("floorplanscreen-save-marker")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeMarker} style={styles.addMarkerButton}>
              <Text style={styles.addMarkerButtonText}>{t("floorplanscreen-close-marker")}</Text>
            </TouchableOpacity>
          </View>
          {showMarker ? (
            <View style={styles.imagePreview}>
              <ImagePicker onImagePicked={setPickedImageUri} />
            </View>
          ) : null}
        </View>
      
        
      
        </>
    )

}

const styles = StyleSheet.create({

    textInputStyle: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        margin: 10,
        paddingHorizontal: 10,
        width: "80%", // Voit säätää leveyttä tarpeen mukaan
      },
      modalButtonContainer: {
        width: "100%",
        justifyContent: "center",
        flexDirection: "row",
      },
      addMarkerButtonText: {
        color: "white",
        alignSelf: "center",
      },
      addMarkerButton: {
        width: "40%",
        backgroundColor: "#812424",
        padding: 10,
        margin: 10,
        borderRadius: 5,
      },

})
export default AddMarkerForm;