import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
            if (imageUri) {
                const imageKey = await uploadImageToS3(imageUri);
                
                await floorplankeySend(worksiteState.currentWorksite._id, imageKey);
                onUpdate && onUpdate(imageKey);
            }
            
            setIsLoading(false);
            setImageUri(null);
            onClose();
            
        } catch (error) {
            console.log("imgmodal", error);
        }
    }
      const delImage = () => {
        setImageUri(null);
        
      }

      if (isLoading) {
        return (
            <DownloadScreen message="ladataan" />
        )
      }

    return (
        <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
            <View style={styles.container}>
                
                <View style={styles.modalView}>
                
                    
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#f5f5f5" />
                    </TouchableOpacity>
                    
                    {imageUri ? 
                        <View style={styles.imagPreviewContainer}>

                            <View style={styles.imageContainer}>
                                <Image source={{ uri: imageUri }} style={{ width: 150, height: 150 }} />
                                {/* <Button title="Lataa kuva" onPress={() => uploadImageToS3(imageUri)} /> */}
                            </View>

                            <TouchableOpacity onPress={handelSaveImage} style={styles.button}>
                            <Text style={{ color: "white" }}>tallenna kuva</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={delImage}>
                                <Ionicons name="trash" size={20} />
                            </TouchableOpacity>
                        </View>
                        :

                        <View>
                            <TouchableOpacity onPress={handleSelectImage} style={styles.button}>
                                <Text style={{ color: "white" }}>{t("worksiteform-add-photo")}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        </Modal>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        paddingVertical: 35,
        paddingHorizontal: 55,
        width: "90%",
        height: '70%',
        alignItems: "center",
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
        margin: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      },
      imagPreviewContainer: {
        justifyContent:'center',
        alignItems: 'center',
        padding: 10,
        
      },
})
export default AddFloorplanImgModal;