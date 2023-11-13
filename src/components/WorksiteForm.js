import { useState } from "react";
import { StyleSheet, View, Button, Image } from "react-native";
import { Text,  Input } from "react-native-elements";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { pickImage, uploadImageToS3, requestMediaLibraryPermissions } from "../../services/ImageService";






const WorksiteForm = ({onSubmit, errorMessage}) => {
    const { t } = useTranslation();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [imageUri, setImageUri] = useState(null);

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
      if (uri) {
        setImageUri(uri);
      }
    };



    return (
      <>
        <View style={styles.companyInfo}>
          <Text style={styles.text}>{t("worksiteform-title")}</Text>
          <View style={styles.infoCard}>
            <Input style={styles.input} placeholder={t("worksiteform-address")} value={address} onChangeText={setAddress} />

            <Input style={styles.input} placeholder={t("worksiteform-city")} value={city} onChangeText={setCity} />

            <Button title="valitse kuva" onPress={handleSelectImage} />
            {imageUri && (
              <View>
                <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />
                {/* <Button title="Lataa kuva" onPress={() => uploadImageToS3(imageUri)} /> */}
              </View>
            )}

            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

            <Button title={t("worksiteform-button")} onPress={handleSubmit} />
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
  button: {
    width: "50%",
  },
});

export default WorksiteForm;
