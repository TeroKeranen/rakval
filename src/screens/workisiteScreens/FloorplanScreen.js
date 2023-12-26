import { StyleSheet, Text, View, Image, Dimensions, ScrollView, Button, TextInput, Modal, Alert, FlatList } from "react-native";
import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { getCurrentDate } from "../../utils/currentDate";
import { calculateNextMarkerNumber } from "../../utils/calculateNextMarkerNumber";

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
import AddFloorplanImg from "../../components/AddFloorplanImg";
import AddMarkerForm from "../../components/FloorplanScreen/AddMarkerForm";




const FloorplanScreen = ({route, navigation}) => {
  const { t } = useTranslation();
  const { state, saveMarkerToDatabase, fetchWorksiteDetails, deleteMarker, updateMarker } = useContext(WorksiteContext);
  const {state: authState } = useContext(AuthContext)
  // const [floorplanKey, setFloorplanKey] = useState(state.currentWorksite.floorplanKey); // asetetaan kuvan uri tietokannasta tänne.
  const [floorplanKey, setFloorplanKey] = useState(state.currentWorksite.floorplanKeys); // asetetaan kuvan uri tietokannasta tänne.
  
  
  const [showMarker, setShowMarker] = useState(false); // Käytetään apuna tätä kun painetaan markeri kuvaan
  const [putMarker, setPutMarker] = useState(false); // Asetataan trueksi kun painetaan "add marker" nappia, kun tämä true, niin avaa add marker modalin

  const [allMarkers, setAllMarkers] = useState([]); // Uusi tilamuuttuja kaikkia markereita varten
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null); // Asetetaan väliaikaisesti markerin tiedot tänne jotta markeri näkyy näytöllä sitä luodessa
  const [markerInfo, setMarkerInfo] = useState(""); // Lisätietoja varten kun luodaan markeria

  const [selectedMarker, setSelectedMarker] = useState(null); // Kun painetaan jotai tehtyä markeria, tallennetaan tänne markerin tiedot.
  const [modalVisible, setModalVisible] = useState(false); // Kun halutaan näyttää modali, asetetaan tämä true arvoon

  
  const [pickedImageUri, setPickedImageUri] = useState(null); // Imagepickerista tuleva kuvan url, käytetään markereissa, tämän avulla tallennetaan kuvan uri databaseen
  const [modalMarkerImage, setModalMarkerImage] = useState(null); // Tallenntaan markerin imageurl tänne. Käytetään tätä näyttämään oikea kuva modalissa
  const [isLoading, SetIsLoading] = useState(false);

  //Markerin muokkaus
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editableMarkerInfo, setEditableMarkerInfo] = useState('');

  const [imageUri, setImageUri] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const [floorplanKeys, setFloorplanKeys] = useState(state.currentWorksite.floorplanKeys || []); // Asetetaan kuvien floorplanKey arvot tänne
  const [selectedFloorplanIndex, setSelectedFloorplanIndex] = useState(0);
  const [selectImageAddMarker, setSelectImageAddMarker] = useState(false); // Tämä kun on true niin aukeaa add marker nappi
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);


 
  

  useEffect(() => {
    
    
    setAllMarkers(state.currentWorksite.markers);
  }, [state.currentWorksite.markers,state.currentWorksite.floorplanKeys]);

  const addMarker = () => {
    setPutMarker(true); // avataan add marker modali
    setMarkerInfo(""); // Tyhjennä aikaisemmat lisätiedot
    setSelectImageAddMarker(false);
    
  };

  
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
    
    // let maxMarkerNumber = 0;
    // if (state.currentWorksite.markers && state.currentWorksite.markers.length > 0) {
    //   maxMarkerNumber = Math.max(...state.currentWorksite.markers.map(marker => marker.markerNumber))
    // }
    // const newMarkerNumber = maxMarkerNumber + 1;
    
    // Käytetään apufunktiota (löytyy utils kansioista) laskemaan markerNumber markerillle
    const newMarkerNumber = calculateNextMarkerNumber(state.currentWorksite.markers);

    const user = authState.user.email;
    if (tempMarkerPosition && markerInfo && user) {
      const markerData = {
        x: tempMarkerPosition.x,
        y: tempMarkerPosition.y,
        info: markerInfo,
        creator: user,
        created: getCurrentDate(),
        imageUri: imageKey || "", // Käytetään ladatun kuvan avainta, jos saatavilla
        markerNumber: newMarkerNumber,
        floorplanIndex: tempMarkerPosition.floorplanIndex

      };
      
      saveMarkerToDatabase(state.currentWorksite._id, markerData); // Tallennetaan marker tietokantaan
      
    }
    SetIsLoading(false); // Otetaan downloadScreen pois käytöstä
    setPickedImageUri(null)
    setPutMarker(false); // suljetaan add marker modali
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

// Käytetään tätä kun halutaan avata  modali
  const handleMarkerPress = (index, pos) => {
    // Tee jotain, kun markeria painetaan
    const markersForThisImage = state.currentWorksite.markers.filter(marker => marker.floorplanIndex === selectedFloorplanIndex)

    const pressedMarker = markersForThisImage[index];
    // const pressedMarker = state.currentWorksite.markers[index];

    
    setModalMarkerImage(pressedMarker.imageUri);
    setSelectedMarker(pressedMarker);
    setModalVisible(true);
    
  };

  // Käytetään tätä kun painetaan merkki kuvaan (silloin ku on luomassa merkkiä)
  const handlePress = (e) => {
    
    const { locationX, locationY } = e.nativeEvent;
    
    if (putMarker) {
      setTempMarkerPosition({ x: locationX, y: locationY, floorplanIndex: selectedFloorplanIndex });
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
    setPutMarker(false) // Sulkee add marker modalin
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

  // MARKERIN UPDATE
  const handleUpdateMarker = async () => {
    // Kutsu backendin päivitysfunktiota ja lähetä muokatut tiedot
    // ...
    
    try {
      
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
   // käytetään tätä kun painetaan kuvaa
  const handleFloorplanSelect = (index) => {
    
    setSelectedFloorplanIndex(index); // asetetaan kuvan indeksi
    // setSelectImageAddMarker(true); // kun tämä on true niin näkyy "add marker" nappi
    setSelectedImageIndex(index);
    console.log(selectedImageIndex)
    
    
    // Mahdolliset muut toiminnot markerin lisäämiseksi
  };

  
  
  // Määritellään, milloin kuva katsotaan näkyväksi/ käytetään flatlist
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50 // Esimerkiksi, kun 50% kuvasta on näkyvissä
  };

  // Päivitetään valittu kuva, kun uusi kuva tulee näkyviin
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const firstVisibleItemIndex = viewableItems[0].index; // otetaan ensimmäisen näkyvän kohteen indexin muutttujaan
      setSelectedFloorplanIndex(firstVisibleItemIndex);
      setSelectedImageIndex(firstVisibleItemIndex);
      setSelectImageAddMarker(true); // Näytä "add marker" nappi
    }
  }, []);


  // käytetään tätä päivittämään näkymä kun lisätää floorplanimage
  const updateFloorplanKeys = (newKey) => {
    setFloorplanKeys([...floorplanKeys, newKey]);
    // Tarvittaessa kutsu fetchWorksiteDetails tai muita päivitysfunktioita
  };



  const renderFloorplanItem = ({ item,index }) => {
    const isSelected = selectedFloorplanIndex === index; // käytetään tätä tuomaan border väri kuvaan
    const markersForThisImage = state.currentWorksite.markers.filter(marker => marker.floorplanIndex === index && index === selectedImageIndex); // näytetään tämän avulla valitun kuvan markerit
    
    return (
        
        <ImageZoom 
          cropWidth={Dimensions.get("window").width}
          cropHeight={Dimensions.get("window").height} // Muokkaa korkeutta tarpeen mukaan
          imageWidth={200} // Muokkaa leveyttä tarpeen mukaan
          imageHeight={200}
        >
          {/* {!putMarker ? (

            <TouchableOpacity onPress={() => handleFloorplanSelect(index)}>

            <Image 
              style={[{ width: 200, height: 200 }, isSelected ? styles.selectedImage : {}]}
              source={{ uri: `${FLOORPLAN_PHOTO_URL}${item}` }}
              />
            </TouchableOpacity>
          ) : (
            
            <TouchableOpacity onPress={handlePress} style={styles.gestureContainer}>
              <Image style={{ width: 200, height: 200 }} source={{ uri: `${FLOORPLAN_PHOTO_URL}${item}` }} />
            </TouchableOpacity>
          )
        } */}
            <TouchableOpacity onPress={handlePress} style={styles.gestureContainer}>
              <Image style={[{ width: 200, height: 200 }, isSelected ? styles.selectedImage : {}]} source={{ uri: `${FLOORPLAN_PHOTO_URL}${item}` }} />
            </TouchableOpacity>
         {showMarker && <View style={[styles.markerStyle, { position: "absolute", left: tempMarkerPosition.x, top: tempMarkerPosition.y }]} />}
         {markersForThisImage.map((pos, markerIndex) => (
            <TouchableOpacity 
              key={markerIndex}
              onPress={() => handleMarkerPress(markerIndex, pos)}
              style={[styles.markerStyle, { position: "absolute", left: pos.x, top: pos.y }]}
            >
              <Text style={styles.markerTextStyle}> {pos.markerNumber}</Text>
            </TouchableOpacity>
          ))}
        </ImageZoom>
        
      
    );
  };
  
  // const imageUri = state.currentWorksite.markers.imageUri;
  if (isLoading) {
    return (
      <DownloadScreen message="ladataan"/>
    )
  }

  return (
    <View style={styles.container}>
      
      <FlatList
        data={floorplanKeys}
        renderItem={renderFloorplanItem}
        keyExtractor={(item, index) => `floorplan-${index}`}
        horizontal={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        />
     
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

      {putMarker ? 

        <AddMarkerForm 
          handleSaveMarker={handleSaveMarker} 
          closeMarker={closeMarker} 
          showMarker={showMarker} 
          setPickedImageUri={setPickedImageUri}
          markerInfo={markerInfo}
          setMarkerInfo={setMarkerInfo}
          />

       : (
        // Kun putMarker asetetaan arvoon false, niin näkyy vain add marker nappi
        <View style={styles.buttonContainer}>
          <AddFloorplanImg imageUri={imageUri} setImageUri={setImageUri} onUpdate={updateFloorplanKeys}/>
          {floorplanKeys.length > 0 && selectImageAddMarker && 
          <>
          <TouchableOpacity onPress={addMarker} style={styles.button}>
            <Text style={{color:'white'}}>{t("floorplanscreen-add-marker")}</Text>
          </TouchableOpacity>

          

          </>
          
          }
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
 
  image: {
    height: "80%",
    width: "90%",
    marginTop: 20,
    borderRadius: 10,
  },
  selectedImage: {
    borderWidth: 2,
    borderColor: 'blue', // Vaihda haluamaksesi väriseksi
  },
});

export default FloorplanScreen;

  