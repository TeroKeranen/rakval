
import { launchCameraAsync } from 'expo-image-picker'
import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { View, Button, Text } from "react-native";

function ImagePicker ({onImagePicked}) {

    const [pickedImage, setPickedImage] = useState('');

    async function takeImageHandler () {
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
        {pickedImage ? <Button title="ota uusi kuva" onPress={takeImageHandler} /> : <Button title="take image" onPress={takeImageHandler} />}
      </View>
    );

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
});

export default ImagePicker;