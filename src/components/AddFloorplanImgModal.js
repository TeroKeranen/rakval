import { Alert, Image, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { pickImage, uploadImageToS3, requestMediaLibraryPermissions } from "../../services/ImageService";
import { useTranslation } from "react-i18next";
import { useState, useContext } from "react";

import {Context as WorksiteContext} from '../context/WorksiteContext';
import DownloadScreen from "./DownloadScreen";


const AddFloorplanImgModal = ({isVisible, onClose, onUpdate}) => {

    const {state: worksiteState, floorplankeySend,fetchWorksiteDetails} = useContext(WorksiteContext);

    const { t } = useTranslation();
    const [imageUri, setImageUri] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imageTitle, setImageTitle] = useState("");


    const handleSelectImage = async () => {

        const permissionGranted = await requestMediaLibraryPermissions();
        if (!permissionGranted) return;
  
        const uri = await pickImage();
        
        if (uri) {
          setImageUri(uri);
        }
      };


    const handelSaveImage = async () => {
        try {
            setIsLoading(true)
            const currenWorksiteId = worksiteState.currentWorksite._id;
            if (imageUri && imageTitle) {
                const imageKey = await uploadImageToS3(imageUri);
                const floorplan = {key: imageKey, title: imageTitle};
                
                await floorplankeySend(worksiteState.currentWorksite._id, floorplan).
                    then(result => {
                        
                        if (result.success) {
                            Alert.alert(t('succeeded'))
                            onUpdate && onUpdate(floorplan);
                        } else {
                            Alert.alert(t('fail'))
                        }
                    })
                // onUpdate && onUpdate(floorplan);
            }
            if (!imageTitle) {
                Alert.alert("Error", t('addFloorplanImgModalTitleError'))
            }
            
            setIsLoading(false);
            setImageUri(null);
            setImageTitle('');
            onClose();
            
        } catch (error) {
            
            Alert.alert("Error", "Jotain meni vikaan")
        }
    }
      const delImage = () => {
        setImageUri(null);
        
      }

    //   if (isLoading) {
    //     return (
    //         <DownloadScreen message={t('loading')} />
    //     )
    //   }

    return (
        <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
            <SafeAreaView style={{flex: 1}}>

            <View style={styles.container}>
                
                <View style={styles.modalView}>
                
                    
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#f5f5f5" />
                    </TouchableOpacity>
                    <TextInput 
                        onChangeText={setImageTitle}
                        value={imageTitle}
                        placeholder={t('addFloorplanImgModalPlaceholder')}
                        style={styles.input}
                        />
                    {imageUri ? 
                        <View style={styles.imagPreviewContainer}>
                            
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: imageUri }} style={{ width: 150, height: 150 }} />
                                {/* <Button title="Lataa kuva" onPress={() => uploadImageToS3(imageUri)} /> */}
                            </View>

                            {!isLoading &&
                            <>
                                <TouchableOpacity onPress={handelSaveImage} style={styles.button}>
                                    <Text style={{ color: "white" }}>{t('addFloorplanImgModalSave')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={delImage}>
                                    <Ionicons name="trash" size={20} />
                                </TouchableOpacity>
                            </>
                            }
                        </View>
                        :
                        
                        <View>
                            <TouchableOpacity onPress={handleSelectImage} style={styles.button}>
                                <Text style={{ color: "white" }}>{t("worksiteform-add-photo")}</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {isLoading && (
                        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
                    )}

                </View>
            </View>
        </SafeAreaView>
        </Modal>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center'
    },
    loadingIndicator: {
        marginTop: 20,
      },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        paddingVertical: 35,
        paddingHorizontal: 55,
        width: "90%",
        height: '70%',
        alignItems: "center",
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    closeButton: {
        position: "absolute",
        right: 0,
        top: 0,
        padding: 10,
        backgroundColor: "#5656e2",
        borderTopRightRadius: 20,
      },
      button: {
        // width: "60%",
        // width: '30%',
        backgroundColor: "#812424",
        padding: 10,
        marginVertical: 20,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      },
      imagPreviewContainer: {
        justifyContent:'center',
        alignItems: 'center',
        padding: 10,
        
        
      },
      input: {
        
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        margin: 10,
        paddingHorizontal: 5,
        paddingVertical: 5,
        width: 200, // Voit säätää leveyttä tarpeen mukaan
        
      }
})
export default AddFloorplanImgModal;