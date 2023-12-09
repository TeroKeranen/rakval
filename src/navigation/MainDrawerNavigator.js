import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";


// Screens


// Context
import { Context as CompanyContext } from "../context/CompanyContext"
import { Context as AuthContext } from "../context/AuthContext";
import { Context as WorksiteContext } from "../context/WorksiteContext";
import { Context as EventContext} from '../context/EventsContext';

// Navigator
import HomeTabsNavigator from './HomeTabsNavigator'
import AdminCompanybtmTab from './adminNavigation/AdminCompanybtmTab'
import AdminNoCompanybtmTab from './adminNavigation/AdminNoCompanybtmTab'
import AdminTabs from './adminNavigation/AdminTabs'
import UserWorksiteTabs from './UserWorksiteTabs'
import { Text } from "react-native";
import MoreTabButton from "../components/MoreTabButton";
import MoreTabModal from "../components/MoreTabModal";

const Drawer = createDrawerNavigator();


// drawer eli sivuvalikko, tässä näytetään eri osia jos käyttäjällä on admin rooli
const MainDrawerNavigator = () => {

    const { t } = useTranslation();
    
    const { clearEvents } = useContext(EventContext);
    const { clearCompany } = useContext(CompanyContext);
    const {state, signout } = useContext(AuthContext);
    const { clearWorksites, resetCurrentWorksite } = useContext(WorksiteContext);
    const [modalVisible, setModalVisible] = useState(false);

     // käytetään tätä uloskirjautumiseen
  const handleSignout = async () => {
    clearEvents(); // pyyhitään tapahtumat etusivulta
    clearWorksites(); // pyyhitään työmaatiedot statesta
    clearCompany(); // pyyhitään company tiedot statesta
    resetCurrentWorksite();
    signout(); // Kutsutaan signout functio
  };

    useEffect(() => {
      // console.log("app.js", state);
    }, [state]);


    const toggleModal = () => {
      setModalVisible(!modalVisible);
    };


    const isAdmin = state.user && state.user.role === "admin";
    const hasCompany = state.user && state.user.company;

    return (
      <>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#4f1c01" }, // Headerin väri
          headerTintColor: "white", // Headerin title ja burderin väri
          sceneContainerStyle: { backgroundColor: "#3f2f25" }, // mikä tämä on ??
          drawerContentStyle: { backgroundColor: "#4f1c01" }, // sivulta tulevan listan background color
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
            <Drawer.Screen name={t("drawerScreen-worksite")} component={hasCompany ? AdminCompanybtmTab : AdminNoCompanybtmTab} />
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
          </>
        )}
        </Drawer.Navigator>
        <MoreTabModal isVisible={modalVisible} onClose={() => setModalVisible(false)} onLogout={handleSignout}/>
        </>
    );

}


export default MainDrawerNavigator