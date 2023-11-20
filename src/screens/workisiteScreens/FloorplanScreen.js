import { StyleSheet, Text, View, Image, Dimensions, ScrollView, Button, TextInput, Modal, Alert } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { getCurrentDate } from "../../utils/currentDate";

import { FLOORPLAN_PHOTO_URL } from "@env";
import {Context as WorksiteContext} from '../../context/WorksiteContext'
import {Context as AuthContext} from '../../context/AuthContext'

import ImageZoom from 'react-native-image-pan-zoom';
import { TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import ImagePicker from "../../components/ImagePicker";
import { uploadImageToS3 } from "../../../services/ImageService";
import DownloadScreen from "../../components/DownloadScreen";




const FloorplanScreen = ({route, navigation}) => {
  const { t } = useTranslation();
  const { state, saveMarkerToDatabase, fetchWorksiteDetails, deleteMarker } = useContext(WorksiteContext);
  const {state: authState } = useContext(AuthContext)
  const [floorplanKey, setFloorplanKey] = useState(state.currentWorksite.floorplanKey); // asetetaan kuvan uri tietokannasta tänne.
  
  
  const [showMarker, setShowMarker] = useState(false); // Käytetään apuna tätä kun painetaan markeri kuvaan
  const [putMarker, setPutMarker] = useState(false);

  const [allMarkers, setAllMarkers] = useState([]); // Uusi tilamuuttuja kaikkia markereita varten
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null); // Asetetaan väliaikaisesti markerin tiedot tänne jotta markeri näkyy näytöllä sitä luodessa
  const [markerInfo, setMarkerInfo] = useState(""); // Lisätietoja varten kun luodaan markeria

  const [selectedMarker, setSelectedMarker] = useState(null); // Kun painetaan jotai tehtyä markeria, tallennetaan tänne markerin tiedot.
  const [modalVisible, setModalVisible] = useState(false); // Kun halutaan näyttää modali, asetetaan tämä true arvoon

  const [moveInfo, setMoveInfo] = useState(false); // vaihdellaa tätä moveInfoBox function avulla.
  const [pickedImageUri, setPickedImageUri] = useState(null); // Imagepickerista tuleva kuvan url, käytetään markereissa, tämän avulla tallennetaan kuvan uri databaseen
  const [modalMarkerImage, setModalMarkerImage] = useState(null); // Tallenntaan markerin imageurl tänne. Käytetään tätä näyttämään oikea kuva modalissa
  const [isLoading, SetIsLoading] = useState(false);

 
  const addMarker = () => {
    setPutMarker(true);
    setMarkerInfo(""); // Tyhjennä aikaisemmat lisätiedot
    
  };

  // kun lisätään markeri niin tällä voidaan liikuttaa tietojensyöttämis lomakkeen ylös tai alas
  const moveInfobox = () => {

    setMoveInfo(prevMoveInfo => !prevMoveInfo);

  }
  
// Tallennetaan uusi markeri tietokantaan
const handleSaveMarker = async () => {
  try {
    SetIsLoading(true) // Asetetaan downloadScreen näkyviin kun painetaan savemarker nappia

    let imageKey; // Määritellään muuttuja kuvan avaimelle

    if (pickedImageUri) {
      imageKey = await uploadImageToS3(pickedImageUri); // Ladataan kuva ja tallennetaan avain
    }

    const user = authState.user.email;
    if (tempMarkerPosition && markerInfo && user) {
      const markerData = {
        x: tempMarkerPosition.x,
        y: tempMarkerPosition.y,
        info: markerInfo,
        creator: user,
        created: getCurrentDate(),
        imageUri: imageKey || "", // Käytetään ladatun kuvan avainta, jos saatavilla
      };
      
      saveMarkerToDatabase(state.currentWorksite._id, markerData); // Tallennetaan marker tietokantaan
      
    }
    SetIsLoading(false); // Otetaan downloadScreen pois käytöstä

    setPutMarker(false);
    setShowMarker(false);
    setTempMarkerPosition(null);
    fetchWorksiteDetails(state.currentWorksite._id);
    
    
  } catch (error) {
    console.error("Error in handleSaveMarker:", error);
  }
};

useEffect(() => {
  console.log("uuuse");
  setAllMarkers(state.currentWorksite.markers);
},[state.currentWorksite.markers])

// Käytetään tätä kun halutaan avata modali
  const handleMarkerPress = (index) => {
    // Tee jotain, kun markeria painetaan
    const pressedMarker = state.currentWorksite.markers[index];

    
    setModalMarkerImage(pressedMarker.imageUri);
    setSelectedMarker(pressedMarker);
    setModalVisible(true);
    
  };

  // Käytetään tätä kun painetaan merkki kuvaan (silloin ku on luomassa merkkiä)
  const handlePress = (e) => {
    const { locationX, locationY } = e.nativeEvent;
    
    if (putMarker) {
      setTempMarkerPosition({ x: locationX, y: locationY });
      setShowMarker(true);
    } else {
      // Tarkista, osuuko painallus mihinkään markeriin
      const pressedMarkerIndex = allMarkers.findIndex(
        (marker) =>
          Math.abs(marker.x - locationX) < 10 && // 10 pikselin toleranssi
          Math.abs(marker.y - locationY) < 10
      );

      if (pressedMarkerIndex !== -1) {
        // Painallus osui markeriin, tee jotain
        console.log(`Markeria painettu indeksissä: ${pressedMarkerIndex}`);
      }
    }
  };

  const closeMarker = () => {
    setPutMarker(false)
    setShowMarker(false);
    setTempMarkerPosition(null);
    setMarkerInfo('');
    
    
    
    
    
  }

  const deleteMarkerHandler = (markerId) => {

    Alert.alert(
      t("floorplanscreen-markerModal-deletemarker-title"),
      t("floorplanscreen-markerModal-deletemarker-confirmtext"),
      [
        {
          text: t("floorplanscreen-markerModal-deletemarker-cancel"),
          onPress: () => console.log("Peruutettu"),
          style: "cancel",
        },
        {
          text: t("floorplanscreen-markerModal-deletemarker-yes"),
          onPress: () => {
            deleteMarker(state.currentWorksite._id, markerId);
            const updatedMarkers = state.currentWorksite.markers.filter((marker) => marker._id !== markerId);
            setAllMarkers(updatedMarkers);

            setModalVisible(false);
          },
        },
      ],
      { cancelable: true }
    );
    
    

    setModalVisible(false);
  }

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
  const imageUri = state.currentWorksite.markers.imageUri;
  if (isLoading) {
    return (
      <DownloadScreen message="ladataan"/>
    )
  }
  return (
    <View style={styles.container}>
      <ImageZoom cropWidth={Dimensions.get("window").width} cropHeight={Dimensions.get("window").height} imageWidth={200} imageHeight={200}>
        {/* <TouchableOpacity > */}
        {/* <Image style={{ width: 200, height: 200 }} source={{ uri: `${FLOORPLAN_PHOTO_URL}${floorplanKey}` }} />
         */}
        {!putMarker ? (
          <Image style={{ width: 200, height: 200 }} source={{ uri: `${FLOORPLAN_PHOTO_URL}${floorplanKey}` }} />
        ) : (
          <TouchableOpacity onPress={handlePress} style={styles.gestureContainer}>
            {/* <TextInput style={styles.textInputStyle} onChangeText={setMarkerInfo} value={markerInfo} placeholder="Syötä markerin lisätiedot" /> */}
            <Image style={{ width: 200, height: 200 }} source={{ uri: `${FLOORPLAN_PHOTO_URL}${floorplanKey}` }} />
          </TouchableOpacity>
        )}
        {showMarker && <View style={[styles.markerStyle, { position: "absolute", left: tempMarkerPosition.x, top: tempMarkerPosition.y }]} />}
        {state.currentWorksite.markers.map((pos, index) => (
          <TouchableOpacity key={index} onPress={() => handleMarkerPress(index)} style={[styles.markerStyle, { position: "absolute", left: pos.x, top: pos.y }]} />
        ))}
      </ImageZoom>

      {/* Modal markerin tiedoille */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setModalMarkerImage(null);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.delBtnContainer}>
            <Text style={{ fontSize: 16 }}>{selectedMarker ? selectedMarker.created : ""}</Text>
            <Text style={{ fontSize: 16 }}>
              {t("floorplanscreen-markerModal-creator")}: {selectedMarker ? selectedMarker.creator : ""}
            </Text>
            <TouchableOpacity onPress={() => deleteMarkerHandler(selectedMarker._id)}>
              <Ionicons name="trash" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalInfo}>
            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>{t("floorplanscreen-markerModal-info")}</Text>
            <Text style={{ fontSize: 16 }}>{selectedMarker ? selectedMarker.info : ""}</Text>
            
            <Image source={{ uri: `${FLOORPLAN_PHOTO_URL}${modalMarkerImage}` }} style={styles.image} />
          </View>
          <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
            <Text>{t("floorplanscreen-close-marker")}</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {putMarker ? (
        <View style={addMarkerContainerStyle}>
          {moveInfo ? (
            <TouchableOpacity onPress={moveInfobox}>
              <Text>{t("floorplanscreen-move-down")}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={moveInfobox}>
              <Text>{t("floorplanscreen-move-up")}</Text>
            </TouchableOpacity>
          )}

          <TextInput style={styles.textInputStyle} onChangeText={setMarkerInfo} value={markerInfo} placeholder={t("floorplanscreen-marker-textinput")} />
          {showMarker ? (
            <View style={styles.imagePreview}>
              <ImagePicker onImagePicked={setPickedImageUri} />
            </View>
          ) : null}
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity onPress={handleSaveMarker} style={styles.addMarkerButton}>
              <Text style={styles.addMarkerButtonText}>{t("floorplanscreen-save-marker")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeMarker} style={styles.addMarkerButton}>
              <Text style={styles.addMarkerButtonText}>{t("floorplanscreen-close-marker")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={addMarker} style={styles.button}>
            <Text>{t("floorplanscreen-add-marker")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
   
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  markerStyle: {
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  gestureContainer: {
    flex: 1,
    width: "100%",
  },

  floorplanImage: {
    width: "100%",
    height: "100%",
  },
  zoomButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 20,
    width: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#DDDDDD",
    padding: 10,
    borderRadius: 5,
  },
  
  addMarkerButton: {
    width: "40%",
    backgroundColor: "#812424",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  addMarkerButtonText: {
    color: "white",
    alignSelf: "center",
  },
  textInputStyle: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
    width: "80%", // Voit säätää leveyttä tarpeen mukaan
  },
  
  modalView: {
    flex:1,
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
  modalInfo: {
    flex: 4,
    width: '100%',
    padding: 20,
    justifyContent:'center',
    alignItems:'center'

  },
  delBtnContainer: {
    width: '100%',
    backgroundColor: '#e6e0e0',
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'row',
    justifyContent:'space-between',
    
    
    
  },
  
  modalButton: {
    backgroundColor: "#DDDDDD",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '30%',
    alignItems: 'center'
  },
  imagePreview: {
    width: '100%'
  },
  modalButtonContainer: {
    
    width: '100%',
    justifyContent:'center',
    flexDirection: 'row'
  },
  image: {
    height: '80%',
    width: '90%',
    marginTop: 20,
    borderRadius: 10,
  }
});

export default FloorplanScreen;