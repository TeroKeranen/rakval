
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import {Context as WorksiteContext} from '../context/WorksiteContext'

import { FLOORPLAN_PHOTO_URL } from "@env";
import { useContext, useEffect, useState } from 'react';

const MarkerinfoModal = ({isVisible, onClose, marker, onEdit, onDelete, isModalMarkerImage}) => {
    const { t } = useTranslation();
    const {state, getSignedUrl} = useContext(WorksiteContext)
    const [isLoading, setIsLoading] = useState(false);
    const [signedUrl, setSignedUrl] = useState(null);
    
    

    useEffect(() => {
      const fetchSignedUrl = async () => {
          if (isModalMarkerImage) {
              setIsLoading(true);
              try {
                  const url = await getSignedUrl(process.env.BUCKET_NAME, isModalMarkerImage);
                  setSignedUrl(url);
              } catch (error) {
                  console.error('Error fetching signed URL:', error);
              } finally {
                  setIsLoading(false);
              }
          }
      };

      if (isVisible) {
          fetchSignedUrl();
      } else {
          setSignedUrl(null); // Reset URL when modal is not visible
      }
  }, [isVisible, isModalMarkerImage, getSignedUrl]);
  
    return (
        <Modal
        animationType="slide"
        
        visible={isVisible}
        onRequestClose={onClose}
      >
        <SafeAreaView style={{flex: 1}}>
        <View style={styles.modalView}>
        {isLoading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
        )}
          <View style={styles.delBtnContainer}>
            <View>

              <Text style={{ fontSize: 16 }}>{marker ? marker.created : ""}</Text>
              <Text style={{ fontSize: 16 }}>
                {t("floorplanscreen-markerModal-creator")}: {marker ? marker.creator : ""}
              </Text>
            </View>
            <TouchableOpacity onPress={onDelete}>
              <Ionicons name="trash" size={20} />
            </TouchableOpacity>
          </View>

          
          <ScrollView contentContainerStyle={styles.scrollViewStyle}>
            {/* <View style={styles.modalInfo}> */}
              
              <TouchableOpacity onPress={onEdit} style={styles.modalButton}>
                <Text style={{color:'white'}}>{t('edit')}</Text>
               </TouchableOpacity>
              


              <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>{t("floorplanscreen-markerModal-info")}</Text>
              <Text style={{ fontSize: 16 }}>{marker ? marker.info : ""}</Text>

              {isModalMarkerImage && signedUrl && (
                
                <Image resizeMode={'stretch'} width={300} height={300} source={{ uri: signedUrl.url }} style={styles.image} />
                )}
              </ScrollView>
              
            {/* </View> */}

          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={{color:'white'}}>{t("floorplanscreen-close-marker")}</Text>
          </TouchableOpacity>
        </View>
        </SafeAreaView>
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
        flex: 1,
        // height: 300,
        // width: 300,
        
        marginTop: 20,
        marginBottom: 40,
        borderRadius: 10,
        // resizeMode: 'contain'
      },
      loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
      },
    

})

export default MarkerinfoModal;