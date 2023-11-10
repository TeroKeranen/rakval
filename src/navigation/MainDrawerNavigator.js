import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Context
import { Context as AuthContext } from "../context/AuthContext"

// Screens


// Navigator
import HomeTabsNavigator from './HomeTabsNavigator'
import AdminCompanybtmTab from './adminNavigation/AdminCompanybtmTab'
import AdminNoCompanybtmTab from './adminNavigation/AdminNoCompanybtmTab'
import AdminTabs from './adminNavigation/AdminTabs'
import UserWorksiteTabs from './UserWorksiteTabs'

const Drawer = createDrawerNavigator();


// drawer eli sivuvalikko, tässä näytetään eri osia jos käyttäjällä on admin rooli
const MainDrawerNavigator = () => {

    const { t } = useTranslation();
    const { state } = useContext(AuthContext);

    useEffect(() => {
      // console.log("app.js", state);
    }, [state]);

    const isAdmin = state.user && state.user.role === "admin";
    const hasCompany = state.user && state.user.company;

    return (
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#351301" }, // Headerin väri
          headerTintColor: "white", // Headerin title ja burderin väri
          sceneContainerStyle: { backgroundColor: "#3f2f25" }, // mikä tämä on ??
          drawerContentStyle: { backgroundColor: "#351301" }, // sivulta tulevan listan background color
          drawerInactiveTintColor: "white", // sivulla olevien linkkien väri
          drawerActiveTintColor: "#351401", // sivulla olevan linkin väri kun aktiicinen
          drawerActiveBackgroundColor: "#e4baa1", // sivulla olevan linkin laatikon väri kun aktiivinen
        }}
      >
        {isAdmin ? (
          <>
            <Drawer.Screen name={t("drawerScreen-front-page")} component={HomeTabsNavigator} />
            <Drawer.Screen name={t("drawerScreen-worksite")} component={hasCompany ? AdminCompanybtmTab : AdminNoCompanybtmTab} />
            {/* <Drawer.Screen name="työmaat" component={AdminWorksiteTabs} /> */}
            <Drawer.Screen name={t("drawerScreen-company")} component={AdminTabs} />
          </>
        ) : (
          <>
            <Drawer.Screen name={t("drawerScreen-front-page")} component={HomeTabsNavigator} />
            <Drawer.Screen name={t("drawerScreen-worksite")} component={UserWorksiteTabs} />
          </>
        )}
      </Drawer.Navigator>
    );

}


export default MainDrawerNavigator