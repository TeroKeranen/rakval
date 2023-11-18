import { StyleSheet, Text, View, Image, Dimensions, ScrollView, Button, TextInput, Modal } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import { FLOORPLAN_PHOTO_URL } from "@env";
import {Context as WorksiteContext} from '../../context/WorksiteContext'
import {Context as AuthContext} from '../../context/AuthContext'

import ImageZoom from 'react-native-image-pan-zoom';
import { TouchableOpacity } from "react-native";



const FloorplanScreen = ({route}) => {
  const { state, saveMarkerToDatabase, fetchWorksiteDetails } = useContext(WorksiteContext);
  const {state: authState } = useContext(AuthContext)
  const [floorplanKey, setFloorplanKey] = useState(state.currentWorksite.floorplanKey);
  
  
  const [showMarker, setShowMarker] = useState(false);
  const [putMarker, setPutMarker] = useState(false);

  const [allMarkers, setAllMarkers] = useState([]); // Uusi tilamuuttuja kaikkia markereita varten
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null);
  const [markerInfo, setMarkerInfo] = useState(""); // Lisätietoja varten

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [moveInfo, setMoveInfo] = useState(false);

  useEffect(() => {
    
    
  },[state.currentWorksite])
 
  const addMarker = () => {
    setPutMarker(true);
    setMarkerInfo(""); // Tyhjennä aikaisemmat lisätiedot
  };

  const moveInfobox = () => {

    setMoveInfo(prevMoveInfo => !prevMoveInfo);

  }

  const handleSaveMarker = () => {
    const user = authState.user.email;
    if (tempMarkerPosition && markerInfo && user) {
      const markerData = {
        x: tempMarkerPosition.x,
        y: tempMarkerPosition.y,
        info: markerInfo,
        creator: user
      };
      
      
      saveMarkerToDatabase(state.currentWorksite._id, markerData);
      // Lisää tarvittavaa käsittelyä onnistumisen tai epäonnistumisen varalta
    }
    setPutMarker(false);
    setShowMarker(false);
    setTempMarkerPosition(null);
    fetchWorksiteDetails(state.currentWorksite._id);
     

  }


  const handleMarkerPress = (index) => {
    // Tee jotain, kun markeria painetaan
    const pressedMarker = state.currentWorksite.markers[index];
    console.log(pressedMarker);
    setSelectedMarker(pressedMarker);
    setModalVisible(true);
    
  };

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
        }}
      >
        <View style={styles.modalView}>
          <Text>Markerin tiedot:</Text>
          <Text>{selectedMarker ? selectedMarker.info : ""}</Text>
          <Text>Luonut: {selectedMarker ? selectedMarker.creator : ""}</Text>

          <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
            <Text>Sulje</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {putMarker ? (
        <View style={addMarkerContainerStyle}>
          {moveInfo ? (
            <TouchableOpacity onPress={moveInfobox}>
              <Text>Siirrä palkki alas</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={moveInfobox}>
              <Text>Siirrä palkki ylös</Text>
            </TouchableOpacity>
          )}

          <TextInput style={styles.textInputStyle} onChangeText={setMarkerInfo} value={markerInfo} placeholder="Syötä markerin lisätiedot" />
          <TouchableOpacity onPress={handleSaveMarker} style={styles.addMarkerButton}>
            <Text style={styles.addMarkerButtonText}>Tallenna merkki</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeMarker} style={styles.addMarkerButton}>
            <Text style={styles.addMarkerButtonText}>sulje</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={addMarker} style={styles.button}>
            <Text>Lisää merkki</Text>
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
    width: "50%",
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
    
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
  
  modalButton: {
    backgroundColor: "#DDDDDD",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
});

export default FloorplanScreen;