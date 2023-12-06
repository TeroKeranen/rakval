import {Text, View, StyleSheet, Alert, TextInput,TouchableOpacity} from "react-native";
import { Button } from "react-native-elements";
import { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import {Context as WorksiteContext} from '../context/WorksiteContext'
import {Context as CompanyContext} from '../context/CompanyContext'
import DownloadScreen from "../components/DownloadScreen";
import ChangeLanguage from "../components/ChangeLanguage";
import { useTranslation } from "react-i18next";


//TO6b2PchlA

// admi2 JH6xHY2UEK

const ProfileScreen = ({navigation}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false); // Käytetään latausindikaattoria
  const { state, fetchUser, signout, joinCompany, clearErrorMessage } = useContext(AuthContext);
  const { clearCompany } = useContext(CompanyContext);
  const { clearWorksites, fetchWorksites, resetCurrentWorksite } = useContext(WorksiteContext);
  const [companyCode, setCompanyCode] = useState("");

  // päivitetään tällä fechUser tiedot aina kun menemme sivulle
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUser(); // Otettu pois mutta jos tulee ongelmia käyttäjätietojen kanssa
      clearErrorMessage();
      
      
    });

    return unsubscribe;
  }, [navigation]);



  const handleJoinCompany = async () => {

    setIsLoading(true);
    const result = await joinCompany(companyCode);
    setIsLoading(false);

    if (result.success) {
     // Onnistunut liittyminen
      clearErrorMessage();
      fetchUser(); // jos tulee ongelmia niin laitettaan takaisin
      fetchWorksites(); // Jos tulee ongelmia niin laitetaan takaisin
     
    } else {
      
      Alert.alert(t('error'), t('profileScreenCompanycodeError'));
        return; // Lopeta funktio, jos ehto ei täyty
      
     // Näytä virheilmoitus käyttäjälle
      
    }
  };


  // Latauskuvake jos etsii tietoja
  if (isLoading) {
    <DownloadScreen message="ladataan" />
  }

  return (
    <View>
      <View style={styles.userInfo}>
        <Text style={styles.text}>{t('email')}: {state.user.email}</Text>
        <Text style={styles.text}>{t('role')} : {state.user.role}</Text>
        {state.user.company ? <Text>{t('profileScreen-company')}: {state.user.company.name}</Text> : null}
        
      </View>
      <View>
        {!state.user.company ?  
          <>
              {/* {state.errorMessage != "" ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null} */}
              <TextInput placeholder={t('profileScreen-placeholder')} value={companyCode} onChangeText={setCompanyCode} style={styles.input} />
              {/* <Button title={t('profileScreen-joincompany')} onPress={handleJoinCompany} /> */}
              <TouchableOpacity style={styles.workDaybutton} onPress={handleJoinCompany}>
                <Text style={{color: 'white'}}>{t('profileScreen-joincompany')}</Text>
              </TouchableOpacity>
          </> : null}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "black",
    margin: 4,
  },
  userInfo: {
    margin: 10,
    alignItems: "center",
    backgroundColor: "#dad1d1",
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    width: '60%',
    alignSelf: 'center',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
  },
  workDaybutton: {
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

export default ProfileScreen;