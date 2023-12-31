import { useEffect, useState } from "react";
import { StyleSheet, View,TouchableOpacity, Alert } from "react-native";
import { Text,  Input } from "react-native-elements";
import { useTranslation } from "react-i18next";

import { pickImage, uploadImageToS3, requestMediaLibraryPermissions } from "../../services/ImageService";


import { useNavigation } from '@react-navigation/native';

import {Picker} from '@react-native-picker/picker';






const WorksiteForm = ({onSubmit, errorMessage, clearError}) => {
    const { t } = useTranslation();
    const [address, setAddress] = useState(""); 
    const [city, setCity] = useState("");
    const [workType, setWorkType] = useState(t('worksiteform-worktype-worksite')); // asetetaan default valueksi työmaa
    const [imageUri, setImageUri] = useState(null);
    
    
    const navigation = useNavigation();

    
    
    const handleSubmit = async () => {
        try {
          if (!address || !city || !workType) {
            Alert.alert("Error", t('goeswrong'))
            return;
          }
          if (imageUri) {
            const imageKey = await uploadImageToS3(imageUri);
            await onSubmit({ address, city, floorplanKey:imageKey, worktype: workType });
          } else {
            await onSubmit({ address, city, worktype: workType });
          }
          // nollataan input kentät onnistunee lisäyksen jälkeen
          setAddress("");
          setCity("");
          
          setImageUri(null);
        } catch (error) {
            console.log(error);
        }
    }

    const handeCancel = () => {
      navigation.navigate(t("construction-site"))
      setAddress('');
      setCity('');
      
    }




    return (
      <>
        <View style={styles.companyInfo}>
          {/* <Text style={styles.text}>{t("worksiteform-title")}</Text> */}
          <View style={styles.infoCard}>
            <Input style={styles.input} placeholder={t("worksiteform-address")} value={address} onChangeText={setAddress} />

            <Input style={styles.input} placeholder={t("worksiteform-city")} value={city} onChangeText={setCity} />

            <Picker
              selectedValue={workType}
              onValueChange={(itemValue, itemIndex) => setWorkType(itemValue)}
            >
              
              <Picker.Item label={t('worksiteform-worktype-worksite')} value={t('worksiteform-worktype-worksite')} />
              <Picker.Item label={t('worksiteform-worktype-privateClient')} value={t('worksiteform-worktype-privateClient')} />
            </Picker>

            
          <View style={styles.addWorksiteButtonContainer}>         
            <TouchableOpacity onPress={handeCancel} style={styles.button}>
              <Text style={{ color: "white" }}>{t("cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={{ color: "white" }}>{t("worksiteform-button")}</Text>
            </TouchableOpacity>
          </View>
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
    flex: 1,
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
    // width: "60%",
    // width: '30%',
    backgroundColor: "#812424",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addWorksiteButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
    
  }
});

export default WorksiteForm;
