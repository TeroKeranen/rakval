import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from "react-i18next";

import {Context as WorksiteContext} from '../context/WorksiteContext'
import { FLOORPLAN_PHOTO_URL } from "@env";
import ImagePicker from './ImagePicker';
import { uploadImageToS3 } from '../../services/ImageService';
import { useContext, useEffect, useState } from 'react';
import DownloadScreen from './DownloadScreen';

const MarkerUpdateModal = ({isVisible, markerInfo, editTableMarkerInfo, onClose,updateMarker,isModalMarkerImage, deleteModalImage}) => {
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


    const handleRemoveImage = () => {
      deleteModalImage(null);
      
    }

    const handleImagePicked = async (imageUri) => {
      // Päivitä modalMarkerImage uudella kuvalla
      try {
        setIsLoading(true);
        imageKey = await uploadImageToS3(imageUri) 
        deleteModalImage(imageKey);
      } catch (error) {
        Alert.alert('Error', t('goeswrong'))
      } finally {

        setIsLoading(false);
      }
  };

  


    return (
        <Modal 
            animationType='slide'
            visible={isVisible}

        >
          <SafeAreaView style={{flex: 1}}>

          <ScrollView>


           
            
            {isLoading ? (
              <DownloadScreen message={t('loading')} />
              ) : 
              
              <View style={styles.modalView}>


            <View style={styles.editModalTitleContainer}>
              <Text style={styles.editModalTitle}>{t('markerUpdatemodalTitle')}</Text>
            </View>

            
            {/* <ScrollView contentContainerStyle={styles.scrollViewStyle}> */}
              {/* <View style={styles.modalInfo}> */}
                
            <View style={styles.editModalTextinput}>
              <TextInput multiline style={styles.textInputStyle} value={markerInfo} onChangeText={editTableMarkerInfo} />
            </View>

              <View style={styles.imageContainer}>
                {isModalMarkerImage && signedUrl ? 
                  <View>

                  
                  <TouchableOpacity onPress={handleRemoveImage} style={styles.delButton}>
                    <Text style={{color: 'white'}}>{t('markerUpdatemodaDelImageBtn')}</Text>
                  </TouchableOpacity>
                  <Image resizeMode={'stretch'} width={100} height={100} source={{ uri: signedUrl.url  }} style={styles.image} />
                  </View>
                  : (
                    <ImagePicker onImagePicked={handleImagePicked} />
                    )}
                {/* </ScrollView> */}
                </View>
              {/* </View> */}
              <View style={styles.editModalButtons}>
              <TouchableOpacity style={styles.editModalButton} onPress={onClose}>
                <Text style={{color:'white'}}>{t('markerUpdatemodalExitBtn')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editModalButton} onPress={updateMarker}>
                <Text style={{color:'white'}}>{t('markerUpdatemodalSaveBtn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          }
        
            
       
      </ScrollView>
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
    
    padding: 20,
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
 
  image: {
    // height: 200,
    // width: 200,
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 10,
    
    
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },

  editModalTitleContainer: {
    marginVertical: 20,
    fontSize: 20,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight:'bold',
  },
  editModalTextinput: {
    
    
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
  },
  textInputStyle: {
    height: 300,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: 300, // Voit säätää leveyttä tarpeen mukaan
    textAlignVertical: 'top'
  },
  editModalButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    
    width: "100%",
  },
  editModalButton: {
    height: 40,
    width: 100,
    margin: 10,
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
  delButton: {
    backgroundColor: "#b85050",
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
  }
  
  
})

export default MarkerUpdateModal;
