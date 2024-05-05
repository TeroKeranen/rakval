import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import { jwtDecode } from "jwt-decode";
// import { decode } from "base-64";
// global.atob = decode;
import {useNavigation} from '@react-navigation/native'
// import {refreshAccessToken} from '../api/refreshToken'

// Screens


// Context
import { Context as CompanyContext } from "../context/CompanyContext"
import { Context as AuthContext } from "../context/AuthContext";
import { Context as WorksiteContext } from "../context/WorksiteContext";
import { Context as EventContext} from '../context/EventsContext';

// Navigator
import HomeTabsNavigator from './HomeTabsNavigator'
import AdminCompanybtmTab from './adminNavigation/AdminCompanybtmTab'

import AdminTabs from './adminNavigation/AdminTabs'
import UserWorksiteTabs from './UserWorksiteTabs'

import MoreTabButton from "../components/MoreTabButton";
import MoreTabModal from "../components/MoreTabModal";

import VerificationScreen from "../screens/VerificationScreen";
import { ImageBackground, StyleSheet } from "react-native";

const Drawer = createDrawerNavigator();



// drawer eli sivuvalikko, tässä näytetään eri osia jos käyttäjällä on admin rooli
const MainDrawerNavigator = () => {

    const { t } = useTranslation();
    const navigation = useNavigation();
    const { clearEvents } = useContext(EventContext);
    const { clearCompany } = useContext(CompanyContext);
    const {state, signout,logout } = useContext(AuthContext);
    const { clearWorksites, resetCurrentWorksite } = useContext(WorksiteContext);
    const [modalVisible, setModalVisible] = useState(false);

     // käytetään tätä uloskirjautumiseen
  const handleSignout = async () => {

    logout().then(() => {

      clearEvents(); // pyyhitään tapahtumat etusivulta
      clearWorksites(); // pyyhitään työmaatiedot statesta
      clearCompany(); // pyyhitään company tiedot statesta
      resetCurrentWorksite();
      signout(); // Kutsutaan signout functio
    })
  };
    

    useEffect(() => {
        
      
    }, [state]);

    
    const toggleModal = () => {
      setModalVisible(!modalVisible);
    };


    const isAdmin = state.user && state.user.role === "admin";
    const isVerified = state.user?.isVerified; 
    
    const hasCompany = state.user && state.user.company;

   
    // Jos käyttäjä ei ole syöttänyt verification koodia niin näytetään VerificationScreen
    if (state?.user && !isVerified) {
      return <VerificationScreen />
    }
    

    
    return (
      
      
      <>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#404558" }, // Headerin väri
          headerTintColor: "white", // Headerin title ja burderin väri
          sceneContainerStyle: { backgroundColor: "#3f2f25" }, // mikä tämä on ??
          drawerContentStyle: { backgroundColor: "#404558" }, // sivulta tulevan listan background color
          drawerInactiveTintColor: "white", // sivulla olevien linkkien väri
          drawerActiveTintColor: "#351401", // sivulla olevan linkin väri kun aktiicinen
          drawerActiveBackgroundColor: "#e4baa1", // sivulla olevan linkin laatikon väri kun aktiivinen
        }}
        >
        
        {isAdmin ? (
          <>
            <Drawer.Screen name={t("drawerScreen-front-page")} component={HomeTabsNavigator} options={{
              headerRight: () => {
                return <MoreTabButton onPress={toggleModal}/>
              }
            }}/>
            <Drawer.Screen name={t("drawerScreen-worksite")} component={AdminCompanybtmTab} />
            {/* <Drawer.Screen name="työmaat" component={AdminWorksiteTabs} /> */}
            <Drawer.Screen name={t("drawerScreen-company")} component={AdminTabs} />
            
          </>
        ) : (
          <>
            <Drawer.Screen name={t("drawerScreen-front-page")} component={HomeTabsNavigator} options={{
              headerRight: () => {
                return <MoreTabButton onPress={toggleModal}/>
              }
            }}/>
            <Drawer.Screen name={t("drawerScreen-worksite")} component={UserWorksiteTabs} />
            <Drawer.Screen name={t("drawerScreen-company")} component={AdminTabs} />
            
          </>
        )}
        </Drawer.Navigator>
        <MoreTabModal isVisible={modalVisible} onClose={() => setModalVisible(false)} onLogout={handleSignout}/>
        </>
        
    );
    
  }

 
  
  
  export default MainDrawerNavigator