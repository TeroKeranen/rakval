import { useEffect, useState } from "react";
import { StyleSheet, View,TouchableOpacity, Alert, Text } from "react-native";
import { Input } from "react-native-elements";
import { useTranslation } from "react-i18next";
import DateTimePicker from '@react-native-community/datetimepicker';




import { useNavigation } from '@react-navigation/native';

import {Picker} from '@react-native-picker/picker';
import DownloadScreen from "./DownloadScreen";







const WorksiteForm = ({onSubmit, errorMessage, clearError}) => {
  
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState(""); 
    const [city, setCity] = useState("");
    const [startTime, setStartTime] = useState(new Date());
    const [workType, setWorkType] = useState(t('worksiteform-worktype-worksite')); // asetetaan default valueksi työmaa
    const [imageUri, setImageUri] = useState(null);
    
    const [showDatePicker, setShowDatePicker] = useState(false);
    
    
    const navigation = useNavigation();


    // Käytetään tätä tuomaan aika muotoon 28/01/2024
    function formatDate(date) {
      if (!(date instanceof Date)) {
        date = new Date(date);  // varmistaa, että syöte on Date-objekti
      }
      let day = date.getDate().toString().padStart(2, '0');  // Päivä, kaksinumeroinen
      let month = (date.getMonth() + 1).toString().padStart(2, '0');  // Kuukausi, kaksinumeroinen (getMonth() palauttaa 0-11)
      let year = date.getFullYear();  // Vuosi, nelinumeroinen
      return `${day}.${month}.${year}`;  // Palauttaa muodossa "pp.kk.vvvv"
    }
    
    
    const handleSubmit = async () => {
      try {
          setIsLoading(true);
          if (!address || !city || !workType) {
              Alert.alert("Error", t('goeswrong'));
              setIsLoading(false);
              return;
          }
          const formattedTime = formatDate(startTime);
          const result = await onSubmit({ address, city, startTime:formattedTime, floorplanKey:imageUri, worktype: workType });
          
          if (result.success) {
              // nollataan input kentät onnistuneen lisäyksen jälkeen
              setAddress("");
              setCity("");
              setStartTime(new Date());
              setImageUri(null);
          } else {
              if (result.paidUser === false) {
                Alert.alert(t('refreshTokenLimitError'))
              } else {

                Alert.alert(t('refreshTokenLimitError'))
              }
              // Näytetään virheilmoitus
             
          }
      } catch (error) {
          Alert.alert('Error', t('goeswrong'))
          
      } finally {
          setIsLoading(false);
      }
  }

    const handeCancel = () => {
      navigation.navigate(t("construction-site"))
      setAddress('');
      setCity('');
      setStartTime('');
      
    }


    const handleDateChange = (event, selectedDate) => {
      const currentDate = selectedDate || startTime;
      setShowDatePicker(false);
      if (event?.type === "dismissed") {
        setStartTime(selectedDate);
      }
      setStartTime(new Date(currentDate));
  };

    
  if (isLoading) {
    return <DownloadScreen message={t("loading")} />;
  }

    return (
      <>
        <View style={styles.companyInfo}>
          {/* <Text style={styles.text}>{t("worksiteform-title")}</Text> */}
          <View style={styles.infoCard}>
            <Input style={styles.input} placeholder={t("worksiteform-address")} value={address} onChangeText={setAddress} />

            <Input style={styles.input} placeholder={t("worksiteform-city")} value={city} onChangeText={setCity} />

            {/* <Input style={styles.input} keyboardType="numeric" placeholder="Aloitus aika muodossa d/m/y" value={startTime} onChangeText={setStartTime} />
             */}
      
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.Dateinput}>
                  <Text style={styles.greyText}>{t('worksiteform-startDate')}</Text>
                  <Text>{startTime ? formatDate(startTime) : 'valitse päivä'}</Text>
              </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={startTime || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

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
  Dateinput: {
    borderBottomWidth: 1,
    borderBottomColor: '#808080ba',
    padding: 5,
    borderRadius: 5,
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
    
  },
  greyText:{
    color: "#8080808b",
    marginVertical: 5

  }
});

export default WorksiteForm;
