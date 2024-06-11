
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from 'expo-image-picker'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, StyleSheet } from 'react-native';
import { View, Button, Text, TouchableOpacity } from "react-native";

function ImagePicker ({onImagePicked}) {

    const {t} = useTranslation();
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

    async function verifyPermissions() {
      if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
        const permissionResponse = await requestPermission();

        return permissionResponse.granted;
      }

      if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
        Alert.alert(
          t('imagePicker-alert'),
          t('imagePicker-alert-message')
        )
        return false;
      }
      return true;
    }

    const [pickedImage, setPickedImage] = useState('');

    async function takeImageHandler () {
        const hasPermission = await verifyPermissions();

        if (!hasPermission) {
          return;
        }
        const image = await launchCameraAsync({
            // allowsEditing: true,
            aspect: [16,9],
            quality: 0.5,
        });
        if (!image.canceled) {
          setPickedImage(image.assets[0].uri);
          onImagePicked(image.assets[0].uri)

        }
        
      }
      
      
    let imagePrevies = <Text style={styles.noImage}>no image taken yet</Text>
    if (pickedImage) {
        
        imagePrevies = <Image style={styles.image} source={{ uri: pickedImage }} />;
    }

    const imagePreview = {
      height: pickedImage ? 200 : 0,
      marginVertical: 8,
      justifyContent: "center",
      alignItems: "center",
      
    };

    return (
      <View>
        <View style={imagePreview}>{imagePrevies}</View>
        {pickedImage ? 
          <TouchableOpacity style={styles.button} onPress={takeImageHandler}>
            <Text style={{color:'white'}}>Ota uusi kuva</Text>
          </TouchableOpacity> : 
          <TouchableOpacity style={styles.button} onPress={takeImageHandler}>
            <Text style={{color:'white'}}>Take image</Text>
          </TouchableOpacity>
          }
      </View>
    );

    // <TouchableOpacity style={styles.modalButton} onPress={takeImageHandler}>
    //   <Text style={{color:'white'}}>Ota uusi kuva</Text>
    // </TouchableOpacity>

}
const styles = StyleSheet.create({
//   imagePreview: {
    
//     height: pickedImage ? 200 : 0,
//     marginVertical: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "red",
//   },
  image: {
    width: "100%",
    height: "100%",
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
  }
});

export default ImagePicker;