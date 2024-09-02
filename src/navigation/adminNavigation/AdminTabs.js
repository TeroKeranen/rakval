import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import AdminScreen from '../../screens/adminScreens/CompanyScreen'
import ProductsData from "../../screens/ProductsData";

const Tab = createBottomTabNavigator();

const AdminTabs = () => {
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

          if (route.name === "Your company" || route.name === "Sinun yritys") {
            iconName = focused ? "key" : "key";
          } else if (route.name === "Products" || route.name === "Tuotteet") {
            iconName = focused ? "pricetags-outline" : "pricetags-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },

        // activeTintColor: "tomato", // väri kun välilehti on aktiivinen
        // inactiveTintColor: "white",
      })}
    >
      <Tab.Screen name={t("tabScreen-company")} component={AdminScreen} options={{ headerShown: false }} />
      <Tab.Screen name={t('products')} component={ProductsData} options={{headerShown:false}} />
    </Tab.Navigator>
  );
};

export default AdminTabs;
