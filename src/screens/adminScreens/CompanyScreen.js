
import { useContext, useState, useEffect } from "react";
import { Context as CompanyContext } from "../../context/CompanyContext";
import {Context as AuthContext} from '../../context/AuthContext'
import {Context as WorksiteContext} from '../../context/WorksiteContext'

import { StyleSheet, View, Button, Text, ActivityIndicator, TextInput, TouchableOpacity, Alert } from "react-native";
import {  Input } from "react-native-elements";
import DownloadScreen from "../../components/DownloadScreen";
import { useTranslation } from "react-i18next";




const CompanyScreen = ({ navigation }) => {

 
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false); // Käytetään latausindikaattoria
  const { state, createCompany, fetchCompany } = useContext(CompanyContext);
  const {state:authState, fetchUser, joinCompany, leaveCompany } = useContext(AuthContext);
  const { state:worksiteState,clearWorksites, fetchWorksites, resetCurrentWorksite } = useContext(WorksiteContext);


  const [companyCode, setCompanyCode] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    
    const loadCompany = async () => {
      setIsLoading(true);
      // await fetchCompany();
      fetchCompany();
      
      setIsLoading(false);
    };
    loadCompany();
    
  }, []);

  const handleCreateCompany = async () => {
    setIsLoading(true);
    const result =  await createCompany({ name, address, city });
    
    if (result.success) {
      Alert.alert(t('companyScreen-successTitle'), t('companyScreen-successText'))
      await fetchUser();
      setIsLoading(false);
    } else {
      Alert.alert(t('error'), t('companyScreen-errorText'))
    }

  };

  const handleJoinCompany = async () => {

    setIsLoading(true);
    const result = await joinCompany(companyCode);
    
    if (result.success) {
      setIsLoading(false);
     // Onnistunut liittyminen
      // clearErrorMessage();
      Alert.alert(t('companyScreen-successTitle'), t('companyScreen-JoinsuccessText'))
      fetchUser(); // jos tulee ongelmia niin laitettaan takaisin
      fetchWorksites(); // Jos tulee ongelmia niin laitetaan takaisin
     
    } else {
      setIsLoading(false);
      Alert.alert(t('error'), t('companyScreen-JoinerrorText'));
      
      
     // Näytä virheilmoitus käyttäjälle
      
    }
  };



  const handleLeaveCompany =  () => {
    Alert.alert(
      t('companyScreen-leavecompanyTitle'),
      t('companyScreen-leavecompanySure'),
      [
        {
          text: t('cancel'),
          onPress: () => console.log("peruutettu"),
          style: 'cancel'
        },
        {
          text: t('delete'),
          onPress: async () => {
            setIsLoading(true);
            const result = await leaveCompany(authState.user._id)
            
            if (result.success) {
              setIsLoading(false)
              Alert.alert(t('companyScreen-successTitle'), t('companyScreen-leavecompanyText'))
              fetchUser();
              clearWorksites();
              // tyhjennetään työmaatiedot worksiteContextissa
              resetCurrentWorksite();

            } else {
              setIsLoading(false)
              Alert.alert(t('error'), t('goeswrong'))
            }

          },
        },
      ],
      {cancelable: true}
    )
    setIsLoading(false);
    setCompanyCode('');
  }

  if (isLoading) {
    return <DownloadScreen message={t("companyScreen-downloadScreen-message")} />;
  }
  const renderCompanyInfo = () => {
    return (
      <View style={styles.companyInfo}>
          <Text style={styles.title}>{t("companyScreen-companyInfo")}</Text>

        {/* Jos käyttäjällä on user rooli niin hänellä on mahdollisuus poistua yrityksestä*/}
        {authState.user.role === "user" ? 
          <View style={styles.infoCard}>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleLeaveCompany} style={styles.button}>
              <Text style={{color: 'white'}}>Delete company</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoTexts}>

            <Text style={styles.text}>
              {t("companyScreen-companyInfo-name")}: {authState.user.company.name}
            </Text>
            <Text style={styles.text}>
              {t("companyScreen-companyInfo-address")}: {authState.user.company.address}
            </Text>
            <Text style={styles.text}>
              {t("companyScreen-companyInfo-city")}: {authState.user.company.city}
            </Text>
            <Text style={styles.text}>
              {t("companyScreen-companyInfo-code")}: {authState.user.company.code}
            </Text>
          
          </View>

        </View>
        :
        // jos käyttäjä on admin niin hänellä ei näy painiketta yrityksestä poistumiseen. vaan hänelle näytetään muokkaa nappi
        <View style={styles.infoCard}>

          <View style={styles.infoTexts}>

            <Text style={styles.text}>
              {t("companyScreen-companyInfo-name")}: {authState.user.company.name}
            </Text>
            <Text style={styles.text}>
              {t("companyScreen-companyInfo-address")}: {authState.user.company.address}
            </Text>
            <Text style={styles.text}>
              {t("companyScreen-companyInfo-city")}: {authState.user.company.city}
            </Text>
            <Text style={styles.text}>
              {t("companyScreen-companyInfo-code")}: {authState.user.company.code}
            </Text>
          
          </View>

        </View>  
      }
        

      </View>
    );
  };

  // Funktio lomakkeen renderöintiin
  const renderCreateForm = () => {
    return (
      
      <View style={styles.addCompanyInfo}>
          <Text style={styles.title}>{t("companyScreen-create")}</Text>
        <View style={styles.addCompanyInfoCard}>
          <Input placeholder={t("companyScreen-companyInfo-name")} value={name} onChangeText={setName} />
          <Input placeholder={t("companyScreen-companyInfo-address")} value={address} onChangeText={setAddress} />
          <Input placeholder={t("companyScreen-companyInfo-city")} value={city} onChangeText={setCity} />
          {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
         
          {/* <Button title={t("companyScreen-create")} onPress={handleCreateCompany} /> */}
          <TouchableOpacity onPress={handleCreateCompany} style={styles.addButton}>
              <Text style={{color: 'white'}}>Create new company</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {(authState.user.role === 'admin'|| authState.user.role === 'superAdmin')  && !authState.user.company ? 
        renderCreateForm() : 
        authState.user.company ? 
          renderCompanyInfo() : 
          <View style={styles.textInputcontainer}>
           
          
                {/* {state.errorMessage != "" ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null} */}
                <TextInput placeholder={t('profileScreen-placeholder')} value={companyCode} onChangeText={setCompanyCode} style={styles.input} />
                {/* <Button title={t('profileScreen-joincompany')} onPress={handleJoinCompany} /> */}
                <TouchableOpacity style={styles.workDaybutton} onPress={handleJoinCompany}>
                  <Text style={{color: 'white'}}>{t('profileScreen-joincompany')}</Text>
                </TouchableOpacity>
            
        </View>
    }
      {/* {authState.user.company ? renderCompanyInfo() : renderCreateForm()} */}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    
    
  },
  infoCard: {
    backgroundColor: "#e8e8f0",
    width: "90%",
    
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
    
  },
  infoTexts: {
    padding: 30,
  },
  buttonContainer: {
    
    alignItems: 'flex-end',
    marginRight: 10,
    
    
  },
  button: {
    backgroundColor: "#507ab8",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        // width: "50%",
        
        
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
  },
  title: {
    fontSize: 30,
    marginBottom: 30,
  },
  text: {
    color: "black",
    fontSize: 15,
    padding: 2,
    margin: 2,
  },
  textInputcontainer: {
    
    width: '100%',
  },
  input: {
    height: 40,
    width: '60%',
    borderRadius: 5,
    borderColor: "gray",
    alignSelf: 'center',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 8,
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
  },
  addCompanyInfo: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 30,
  },
  addCompanyInfoCard: {
    backgroundColor: "#e8e8f0",
    width: "90%",
    padding: 20,
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
  addButton: {
    backgroundColor: "#507ab8",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        // width: "50%",
        alignSelf: 'center',
        
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

export default CompanyScreen;
