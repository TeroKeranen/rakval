import {Text, View, StyleSheet, Alert, TextInput} from "react-native";
import { Button } from "react-native-elements";
import { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import {Context as WorksiteContext} from '../context/WorksiteContext'
import {Context as CompanyContext} from '../context/CompanyContext'
import DownloadScreen from "../components/DownloadScreen";


//TO6b2PchlA

// admi2 JH6xHY2UEK

const ProfileScreen = ({navigation}) => {

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
        <Text style={styles.text}>Sähköposti: {state.user.email}</Text>
        <Text style={styles.text}>Rooli : {state.user.role}</Text>
      </View>

      {/* admin käyttäjä */}
      {state.user.role === "admin" ? (
        <Text>Olet admin käyttäjä</Text>
      ) : (
        // normi käyttäjä
        <>
          {state.user.company ? (
            <Text>Olet liittynyt yritykseen {state.user.company.name}</Text>
          ) : (
            // jos käyttäjä ei ole liittynyt yritykseen
            <>
              {state.errorMessage != "" ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
              <TextInput placeholder="Enter company code" value={companyCode} onChangeText={setCompanyCode} style={styles.input} />
              <Button title="Lisää yritys" onPress={handleJoinCompany} />
            </>
          )}
        </>
      )}

      <Button title="Sign out" onPress={handleSignout} />
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