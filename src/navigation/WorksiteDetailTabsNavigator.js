import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { Context as AuthContext } from "../context/AuthContext";

// Screens
import WorksiteDetails from "../screens/workisiteScreens/WorksiteDetails";
import WorksiteWorkers from "../screens/workisiteScreens/WorksiteWorkers";
import { useContext, useEffect } from "react";
import FloorplanScreen from "../screens/workisiteScreens/FloorplanScreen";
import WorksiteEventsScreen from "../screens/workisiteScreens/WorksiteEventsScreen";


const Tab = createBottomTabNavigator();

const WorksiteDetailsTabsNavigator = ({route}) => {

    const { t } = useTranslation();

    const {state, fetchUser} = useContext(AuthContext)

    const isAdmin = state.user.role === 'admin';

    
    
    
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarActiveTintColor: "#f48b28",
            tabBarInactiveTintColor: "#a3845c",
            tabBarStyle: {
              backgroundColor: "#4f1c01",
            },
  
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === "Construction site" || route.name === "Työmaa") {
                iconName = focused ? "business" : "business-outline";
              } else if (route.name === "Floor plan" || route.name === "Pohjakuva") {
                iconName = focused ? "map" : "map-outline";
              } else if (route.name === "Workers" || route.name === "Työntekijät") {
                iconName = focused ? 'people' : 'people-outline';
              } else if (route.name ==="tapahtumat" ) {
                iconName = focused ? "list" : 'list-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
  
            // activeTintColor: "tomato", // väri kun välilehti on aktiivinen
            // inactiveTintColor: "white",
          })}
        >
            <Tab.Screen name ={t('worksiteDetail')} component={WorksiteDetails} options={{headerShown:false}} initialParams={{worksiteId: route.params.worksiteId}} />
            <Tab.Screen name={t('floorplan')} component={FloorplanScreen} options={{headerShown:false}} />
            <Tab.Screen name="tapahtumat" component={WorksiteEventsScreen} options={{headerShown: false}} />
            
            {isAdmin ? <Tab.Screen name={t('workers')} component={WorksiteWorkers} /> : null}
            
        </Tab.Navigator>
    )




};

export default WorksiteDetailsTabsNavigator;
