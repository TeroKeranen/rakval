import * as ImagePicker from "expo-image-picker";
import { Storage } from "aws-amplify";



const requestMediaLibraryPermissions = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    alert("Permission to access camera roll is required!");
    return false;
  }
  return true;
};

const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return null;
};

const uploadImageToS3 = async (imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const key = `${new Date().getTime()}-my-image.jpg`;

    await Storage.put(key, blob, {
      contentType: "image/jpeg",
      level: 'public'
    })
    .then((res) => {
      Storage.get(res.key)
      .then((result) => {
        
        let awsImageUrl = result.substring(0, result.indexOf('?'))
        
      })
    })
    ;

    
    return key; // Palauta avain (key), jotta voit viitata kuvaan myöhemmin
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
};

export { requestMediaLibraryPermissions, pickImage, uploadImageToS3 };