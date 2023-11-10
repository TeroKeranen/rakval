import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import WorkSite from "../../screens/workisiteScreens/WorkSite";

const Tab = createBottomTabNavigator();

// Näytetään tämä silloin kun adminin ei ole missään yhtiössä. Näkyy vain "työmaat" alatab
const AdminNoCompanybtmTab = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#f48b28",
        tabBarInactiveTintColor: "#a3845c",
        tabBarStyle: {
          backgroundColor: "#351301",
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "add new") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Työmaat") {
            iconName = focused ? "list" : "list-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },

        // activeTintColor: "tomato", // väri kun välilehti on aktiivinen
        // inactiveTintColor: "white",
      })}
    >
      <Tab.Screen name="Työmaat" component={WorkSite} />
    </Tab.Navigator>
  );

};

export default AdminNoCompanybtmTab;
