import { useCallback, useState } from "react";
import { StyleSheet, View, Button, Image, TouchableOpacity } from "react-native";
import { Text,  Input } from "react-native-elements";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { pickImage, uploadImageToS3, requestMediaLibraryPermissions } from "../../services/ImageService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";






const WorksiteForm = ({onSubmit, errorMessage, clearError}) => {
    const { t } = useTranslation();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [imageUri, setImageUri] = useState(null);
    const [isImage, setIsImage] = useState(true); // Käytetään avuksi poistamaan "Lisää kuva" nappi

    // useFocusEffect(
    //   useCallback(() => {
    //     clearError();
        
    //   }, [])
    // )

    const handleSubmit = async () => {
        try {
          if (imageUri) {
            const imageKey = await uploadImageToS3(imageUri);
            await onSubmit({ address, city, floorplanKey:imageKey });
          } else {
            await onSubmit({ address, city });
          }
          // nollataan input kentät onnistunee lisäyksen jälkeen
          setAddress("");
          setCity("");
          setImageUri(null);
        } catch (error) {
            console.log(error);
        }
    }


    const handleSelectImage = async () => {
      const permissionGranted = await requestMediaLibraryPermissions();
      if (!permissionGranted) return;

      const uri = await pickImage();
      console.log("jurii",uri);
      if (uri) {
        setImageUri(uri);
      }
    };

    const delImage = () => {
      setImageUri(null);
    }



    return (
      <>
        <View style={styles.companyInfo}>
          <Text style={styles.text}>{t("worksiteform-title")}</Text>
          <View style={styles.infoCard}>
            <Input style={styles.input} placeholder={t("worksiteform-address")} value={address} onChangeText={setAddress} />

            <Input style={styles.input} placeholder={t("worksiteform-city")} value={city} onChangeText={setCity} />

            {!imageUri ? 
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleSelectImage} style={styles.button}>
                <Text style={{ color: "white" }}>{t("worksiteform-add-photo")}</Text>
              </TouchableOpacity>

              {/* <Button title={t("worksiteform-button")} onPress={handleSubmit} /> */}
            </View>
            : null
          }

            {/* <Button title={t("worksiteform-add-photo")} onPress={handleSelectImage} /> */}
            {imageUri && (
              <View style={styles.imagPreviewContainer}>

              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={{ width: 150, height: 150 }} />
                {/* <Button title="Lataa kuva" onPress={() => uploadImageToS3(imageUri)} /> */}
              </View>
              <TouchableOpacity onPress={delImage}>
                <Ionicons name="trash" size={20} />
              </TouchableOpacity>
              </View>
            )}

            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
          </View>
          <View style={styles.addWorksiteButtonContainer}>

          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={{ color: "white" }}>{t("worksiteform-button")}</Text>
          </TouchableOpacity>
          </View>
        </View>
      </>
    );

    
};

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    color: "red",
  },
  infoCard: {
    backgroundColor: "#e8e8f0",
    width: "90%",
    padding: 40,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  companyInfo: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 30,
    alignItems: "center",
  },
  text: {
    alignSelf: "center",
    marginBottom: 50,
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imagPreviewContainer: {
    justifyContent:'center',
    alignItems: 'center',
    padding: 10,
    
  },
  imageContainer: {
    marginBottom: 20,
    
    
  },
  button: {
    width: "60%",
    backgroundColor: "#812424",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addWorksiteButtonContainer: {
    marginVertical: 20,
  }
});

export default WorksiteForm;
