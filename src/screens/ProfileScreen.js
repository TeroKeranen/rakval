import {Text, View, StyleSheet, Alert, TextInput} from "react-native";
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
     // Näytä virheilmoitus käyttäjälle
      console.log("Liittymisessä yritykseen tapahtui virhe:", result.error);
    }
  };


  // käytetään tätä uloskirjautumiseen
  const handleSignout = async () => {
    clearWorksites(); // pyyhitään työmaatiedot statesta
    clearCompany(); // pyyhitään company tiedot statesta
    resetCurrentWorksite();
    signout(); // Kutsutaan signout functio
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
      </View>

      {/* admin käyttäjä */}
      {state.user.role === "admin" ? (
        <Text>{t('profileScreen-role')}</Text>
      ) : (
        // normi käyttäjä
        <>
          {state.user.company ? (
            <Text>{t('profileScreen-company')} {state.user.company.name}</Text>
          ) : (
            // jos käyttäjä ei ole liittynyt yritykseen
            <>
              {state.errorMessage != "" ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
              <TextInput placeholder={t('profileScreen-placeholder')} value={companyCode} onChangeText={setCompanyCode} style={styles.input} />
              <Button title={t('profileScreen-joincompany')} onPress={handleJoinCompany} />
            </>
          )}
        </>
      )}

      <Button title={t('profileScreen-signout')} onPress={handleSignout} />
      <ChangeLanguage />
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
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
  },
});

export default ProfileScreen;