import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import WorkSite from "../screens/workisiteScreens/WorkSite";

const Tab = createBottomTabNavigator();

// Tämä alatabit näkyy normikäyttäjälle joka ei ole admin drawerin työmaasivustolla. 
const UserWorksiteTabs = () => {

    const { t } = useTranslation();
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#f48b28",
          tabBarInactiveTintColor: "#a3845c",
          tabBarStyle: {
            backgroundColor: "#404558",
          },

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "add new") {
              iconName = focused ? "add-circle" : "add-circle-outline";
            } else if (route.name === "Työmaat" || route.name === "Construction sites") {
              iconName = focused ? "list" : "list-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },

          // activeTintColor: "tomato", // väri kun välilehti on aktiivinen
          // inactiveTintColor: "white",
        })}
      >
        <Tab.Screen name={t("construction-site")} component={WorkSite} options={{ headerShown: false }} />
      </Tab.Navigator>
    );

}

export default UserWorksiteTabs;
