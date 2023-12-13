
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";


// Screens
import Etusivu from "../screens/Etusivu";
import ProfileScreen from "../screens/ProfileScreen";

// stacknavigator
import ProfileStackNavigator from "./ProfileStackNavigator";

// Components

import { StatusBar } from "expo-status-bar";


const Tab = createBottomTabNavigator();

const HomeTabsNavigator = () => {
  
  const { t } = useTranslation();


  return (
    <>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#f48b28",
          tabBarInactiveTintColor: "#a3845c",
          tabBarStyle: {
            backgroundColor: "#4f1c01",
          },

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Profile" || route.name === "Profiili") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Main page" || route.name === "Etusivu") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "More") {
              iconName =focused ? "build" : "build-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },

          // activeTintColor: "tomato", // väri kun välilehti on aktiivinen
          // inactiveTintColor: "white",
        })}
      >
        <Tab.Screen name={t("main-page")} component={Etusivu} options={{ 
          headerShown: false,
          }} />
        <Tab.Screen name={t("profile")} component={ProfileStackNavigator} options={{ headerShown: false }} />
        
      </Tab.Navigator>

      
    </>
  );
}




export default HomeTabsNavigator;