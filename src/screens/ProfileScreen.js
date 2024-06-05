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
  const [isLoading, setIsLoading] = useState(true); // Käytetään latausindikaattoria
  const { state, fetchUser, signout, joinCompany, clearErrorMessage } = useContext(AuthContext);
  const { clearCompany } = useContext(CompanyContext);
  const { clearWorksites, fetchWorksites, resetCurrentWorksite } = useContext(WorksiteContext);
  const [companyCode, setCompanyCode] = useState("");

  // päivitetään tällä fechUser tiedot aina kun menemme sivulle
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await fetchUser(); // Varmista, että fetchUser on määritelty palauttamaan Promise
      clearErrorMessage();
      setIsLoading(false); // Asetetaan false, kun tiedot on ladattu
    });

    return () => unsubscribe();
  }, [navigation, fetchUser, clearErrorMessage]);

  // console.log("user", state.user.email);


  

  const navigateToChangePassword = () => {
    navigation.navigate('ChangepasswordScreen')
  }

  // Latauskuvake jos etsii tietoja
  if (isLoading || !state.user) {
    return <DownloadScreen message={t('loading')} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        
        <View >
          {/* {state.user.email ? <Text style={styles.text}>{t('email')}: {state.user.email}</Text> : null} */}
          <Text style={styles.text}>{t('email')}: {state.user.email}</Text>
          <Text style={styles.text}>{t('role')} : {state.user.role}</Text>
          {state.user.company ? <Text style={styles.text}>{t('profileScreen-company')}: {state.user.company.name}</Text> : null}
        </View>

        <View>
          <TouchableOpacity onPress={navigateToChangePassword} style={styles.button}>
            <Text style={{color:'white'}}>{t('profileScreenChangePassword')}</Text>
          </TouchableOpacity>
        </View>
      

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "black",
    margin: 4,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    
  },
  userInfo: {
    flex: 1,
    backgroundColor: "#e8e8f0",
    width: '90%',
    marginVertical: 20,
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
    justifyContent: 'space-between'
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
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
        flexDirection:'row'
  }
  
});

export default ProfileScreen;