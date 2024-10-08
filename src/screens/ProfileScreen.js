import {Text, View, StyleSheet, Alert, TextInput,TouchableOpacity} from "react-native";

import { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import {Context as WorksiteContext} from '../context/WorksiteContext'
import {Context as CompanyContext} from '../context/CompanyContext'
import DownloadScreen from "../components/DownloadScreen";

import { useTranslation } from "react-i18next";
import DeleteRequestModal from "../components/DeleteRequestModal";


//TO6b2PchlA

// admi2 JH6xHY2UEK

const ProfileScreen = ({navigation}) => {

  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true); // Käytetään latausindikaattoria
  const [modalVisible, setModalVisible] = useState(false) // käytetään tätä apuna kun avataan deleteRequestModal
  const [title, setTitle] = useState(''); // Deleterequestia varten
  const [text, setText] = useState(''); // Deleterequestia varten

  const [companyCode, setCompanyCode] = useState("");

  const { state, fetchUser, signout, joinCompany, clearErrorMessage,deleteAccount, deleteAccountRequest } = useContext(AuthContext);
  const { clearCompany } = useContext(CompanyContext);
  const { clearWorksites, fetchWorksites, resetCurrentWorksite } = useContext(WorksiteContext);

  // päivitetään tällä fechUser tiedot aina kun menemme sivulle
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await fetchUser(); // Varmista, että fetchUser on määritelty palauttamaan Promise
      clearErrorMessage();
      setIsLoading(false); // Asetetaan false, kun tiedot on ladattu
    });

    return () => unsubscribe();
  }, [navigation, fetchUser, clearErrorMessage]);

  

  // Modalin avaamiseen 
  const openModal = () => {
    setModalVisible(true);
  }

  const handleDeleteUser = async () => {

    Alert.alert(
      t('profileScreen-delUser-title'),
      t('profileScreen-delUser-text'), 
    [
      {
        text: t('cancel'),
        onPress: () => console.log("peruutettu"),
        style: 'cancel'
      },
      {
        text: t('profileScreen-delUser-again'),
        onPress: async () => {
          setIsLoading(true);
          try {
            const result = await deleteAccount();

            if (result.success) {
              Alert.alert(t('profileScreen-delUser-success'));
              signout()
              setIsLoading(false)
            } else {
              Alert.alert(t('fail'))
              setIsLoading(false)
            }
            
          } catch (error) {
            Alert.alert(t('fail'))
            setIsLoading(false)
          }

        } 
      }
    ],
    {cancelable: true}
    )
  }
  

  const navigateToChangePassword = () => {
    navigation.navigate('ChangepasswordScreen')
  }

  // Modal request
  const onSubmit = async() => {

    Alert.alert(
      t('profileScreen-delUser-title'),
      t('profileScreen-delUser-text'),
      [
        {
          text: t('cancel'),
          onPress: () => console.log("peruutettu"),
          style: 'cancel'
        },
        {
          text: t('profileScreen-delUser-again'),
          onPress: async () => {
            setIsLoading(true);
            try {
              
              const response = await deleteAccountRequest(title,text);

              if (response.success) {
                Alert.alert(t('profileScreen-delUser-success'));
                setIsLoading(false);
                setModalVisible(false);
                setText("");
                setTitle("");
              } else {
                Alert.alert(t('fail'))
                setIsLoading(false)
              }
            } catch (error) {
              Alert.alert(t('fail'))
              setIsLoading(false)
            }
          }
        }
      ],
      {cancelable: true}
    )

    
  
    
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

          {/* <TouchableOpacity onPress={handleDeleteUser} style={styles.button}>
            <Text style={{color:'white'}}>{t('profileScreen-delUser-button')}</Text>
          </TouchableOpacity> */}

          <TouchableOpacity onPress={openModal} style={styles.button}>
            <Text style={{color:'white'}}>{t('profileSceen-accountRemove-btn')}</Text>
          </TouchableOpacity>
        </View>
      

      </View>

      <DeleteRequestModal 
        isVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setText("");
          setTitle("");
        }}
        title={title}
        setTitle={setTitle}
        text={text}
        setText={setText}
        onSubmit={onSubmit}
      />
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