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
import MarkerinfoModal from "../../components/MarkerinfoModal";
import MarkerUpdateModal from "../../components/MarkerUpdateModal";




const FloorplanScreen = ({route, navigation}) => {
  const { t } = useTranslation();
  const { state, saveMarkerToDatabase, fetchWorksiteDetails, deleteMarker, updateMarker } = useContext(WorksiteContext);
  const {state: authState } = useContext(AuthContext)
  const [floorplanKey, setFloorplanKey] = useState(state.currentWorksite.floorplanKey); // asetetaan kuvan uri tietokannasta tänne.
  
  
  const [showMarker, setShowMarker] = useState(false); // Käytetään apuna tätä kun painetaan markeri kuvaan
  const [putMarker, setPutMarker] = useState(false); // Asetataan trueksi kun painetaan "add marker" nappia, tällä asetetaan eri näkymiä näkyville

  const [allMarkers, setAllMarkers] = useState([]); // Uusi tilamuuttuja kaikkia markereita varten
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null); // Asetetaan väliaikaisesti markerin tiedot tänne jotta markeri näkyy näytöllä sitä luodessa
  const [markerInfo, setMarkerInfo] = useState(""); // Lisätietoja varten kun luodaan markeria

  const [selectedMarker, setSelectedMarker] = useState(null); // Kun painetaan jotai tehtyä markeria, tallennetaan tänne markerin tiedot.
  const [modalVisible, setModalVisible] = useState(false); // Kun halutaan näyttää modali, asetetaan tämä true arvoon

  const [moveInfo, setMoveInfo] = useState(false); // vaihdellaa tätä moveInfoBox function avulla.
  const [pickedImageUri, setPickedImageUri] = useState(null); // Imagepickerista tuleva kuvan url, käytetään markereissa, tämän avulla tallennetaan kuvan uri databaseen
  const [modalMarkerImage, setModalMarkerImage] = useState(null); // Tallenntaan markerin imageurl tänne. Käytetään tätä näyttämään oikea kuva modalissa
  const [isLoading, SetIsLoading] = useState(false);

  //Markerin muokkaus
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editableMarkerInfo, setEditableMarkerInfo] = useState('');

  useEffect(() => {
    console.log("testi1");
    
    setAllMarkers(state.currentWorksite.markers);
  }, [state.currentWorksite.markers]);

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

    if (!tempMarkerPosition || !markerInfo) {
      Alert.alert("Virhe", "Markerin sijainti ja tiedot ovat pakollisia.");
      return; // Lopeta funktio, jos ehto ei täyty
    }
    SetIsLoading(true) // Asetetaan downloadScreen näkyviin kun painetaan savemarker nappia

    let imageKey; // Määritellään muuttuja kuvan avaimelle

    if (pickedImageUri) {
      imageKey = await uploadImageToS3(pickedImageUri); // Ladataan kuva ja tallennetaan avain
    }
    console.log(imageKey);
    const user = authState.user.email;
    if (tempMarkerPosition && markerInfo && user) {
      const markerData = {
        x: tempMarkerPosition.x,
        y: tempMarkerPosition.y,
        info: markerInfo,
        creator: user,
        created: getCurrentDate(),
        imageUri: imageKey || "", // Käytetään ladatun kuvan avainta, jos saatavilla
        markerNumber: state.currentWorksite.markers.length + 1

      };
      
      saveMarkerToDatabase(state.currentWorksite._id, markerData); // Tallennetaan marker tietokantaan
      
    }
    SetIsLoading(false); // Otetaan downloadScreen pois käytöstä
    setPickedImageUri(null)
    setPutMarker(false);
    setShowMarker(false);
    setTempMarkerPosition(null);
    fetchWorksiteDetails(state.currentWorksite._id);
    
    
  } catch (error) {
    console.error("Error in handleSaveMarker:", error);
  }
};

useEffect(() => {
  
  setAllMarkers(state.currentWorksite.markers);
},[state.currentWorksite.markers])

// Käytetään tätä kun halutaan avata modali
  const handleMarkerPress = (index, pos) => {
    // Tee jotain, kun markeria painetaan
    console.log(pos);
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


  // Käytetään kun suljetaan markerin modali
  const closeMarker = () => {
    setPutMarker(false)
    setShowMarker(false);
    setTempMarkerPosition(null);
    setPickedImageUri(null)
    setMarkerInfo('');  
  }


  // Käytetään kun poistetaan marker
  const deleteMarkerHandler = (markerId) => {
    const markerNumber = selectedMarker ? selectedMarker.markerNumber : null;
    
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
            deleteMarker(state.currentWorksite._id, markerId, markerNumber);
            // deleteMarker(state.currentWorksite._id, markerId);
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

  // Markerin muokkaus
  const handleEditMarker = () => {
    setEditableMarkerInfo(selectedMarker.info);
    setEditModalVisible(true);
  }

  const handleUpdateMarker = async () => {
    // Kutsu backendin päivitysfunktiota ja lähetä muokatut tiedot
    // ...
    
    try {
      console.log(modalMarkerImage);
      // console.log(modalMarkerImage);
      const updatedMarkerData = {
        ...selectedMarker,
        info: editableMarkerInfo,
        imageUri: modalMarkerImage
        
        
        
      }
      if (!updatedMarkerData.info) {
        Alert.alert(t('Error'), t('worksiteUpdateError'));
        return; // Lopeta funktio, jos ehto ei täyty
      }
      
      await updateMarker(state.currentWorksite._id, selectedMarker._id, updatedMarkerData)
      setSelectedMarker(updatedMarkerData)
      setEditModalVisible(false);
      fetchWorksiteDetails(state.currentWorksite._id)
    } catch (error) {
      console.error("Error updating marker:", error);
    }
    
  };

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
  const imageUri = state.currentWorksite.markers.imageUri;
  if (isLoading) {
    return (
      <DownloadScreen message="ladataan"/>
    )
  }
  return (
    <View style={styles.container}>

      <ImageZoom cropWidth={Dimensions.get("window").width} cropHeight={Dimensions.get("window").height} imageWidth={200} imageHeight={200}>
       
         {/* Jos putMarker on true niin näytetään pohjakuvaa johon voi painaa markereita*/}

        {!putMarker ? (
          <Image style={{ width: 200, height: 200 }} source={{ uri: `${FLOORPLAN_PHOTO_URL}${floorplanKey}` }} />
        ) : (
          <TouchableOpacity onPress={handlePress} style={styles.gestureContainer}>
            {/* <TextInput style={styles.textInputStyle} onChangeText={setMarkerInfo} value={markerInfo} placeholder="Syötä markerin lisätiedot" /> */}
            <Image style={{ width: 200, height: 200 }} source={{ uri: `${FLOORPLAN_PHOTO_URL}${floorplanKey}` }} />
          </TouchableOpacity>
        )}

        {/* Kun markeri on painettu pohjakuvaan niin showMarker asetetaan true arvoon ja silloin näytetään markerin pohjakuvassa  */}
        {showMarker && <View style={[styles.markerStyle, { position: "absolute", left: tempMarkerPosition.x, top: tempMarkerPosition.y }]} />}
        {/* Käydään läpi kaikki markerit ja näytetään ne pohjakuvassa */}
        {state.currentWorksite.markers.map((pos, index) => (
          <TouchableOpacity key={index} onPress={() => handleMarkerPress(index,pos)} style={[styles.markerStyle, { position: "absolute", left: pos.x, top: pos.y }]} >
            <Text style={styles.markerTextStyle}> {pos.markerNumber}</Text>
          </TouchableOpacity>
        ))}
      </ImageZoom>

      {/* Modal markerin tiedoille */}
      <MarkerinfoModal 
        isVisible={modalVisible} 
        onClose={() => {
          setModalVisible(false)
          setModalMarkerImage(null);
        }} 
        marker={selectedMarker} 
        onEdit={handleEditMarker} 
        onDelete={() => deleteMarkerHandler(selectedMarker._id)}
        isModalMarkerImage={modalMarkerImage}
      />

      {/* Merkinnän update modal */}
        <MarkerUpdateModal 
          isVisible={editModalVisible}
          markerInfo={editableMarkerInfo}
          editTableMarkerInfo={setEditableMarkerInfo}
          onClose={() => setEditModalVisible(false)}
          updateMarker={handleUpdateMarker}
          isModalMarkerImage={modalMarkerImage}
          deleteModalImage={setModalMarkerImage}
          
          
        />
      
      
      {/* Jos put marker on true arvossa niin näkyy markerin lisäys formi. false arvossa näkyy vain painike jossa lukee add marker */}
      {putMarker ? (
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
        // Kun putMarker asetetaan arvoon false, niin näkyy vain add marker nappi
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={addMarker} style={styles.button}>
            <Text style={{color:'white'}}>{t("floorplanscreen-add-marker")}</Text>
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
    borderRadius: 5,
    backgroundColor: "red",
    
    justifyContent:'center',
    
  },
  markerTextStyle: {
    color: 'white', // teksti värin
    fontSize: 6,
    textAlign: 'center',
    marginRight: 1,
    
    
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
    backgroundColor: "#507ab8",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        // width: "50%",
        alignItems: "center",
        alignSelf:'center',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
  imagePreview: {
    width: "100%",
  },
  modalButtonContainer: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
  },
  image: {
    height: "80%",
    width: "90%",
    marginTop: 20,
    borderRadius: 10,
  },
});

export default FloorplanScreen;

  