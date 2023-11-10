
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

// Context
import { Context as CompanyContext } from "../context/CompanyContext"
import { Context as AuthContext } from "../context/AuthContext";
import { Context as WorksiteContext } from "../context/WorksiteContext";

// Screens
import Etusivu from "../screens/Etusivu";
import ProfileScreen from "../screens/ProfileScreen";

// Components
import MoreTabButton from "../components/MoreTabButton";
import MoreTabModal from "../components/MoreTabModal";


const Tab = createBottomTabNavigator();

const HomeTabsNavigator = () => {
  const { clearCompany } = useContext(CompanyContext);
  const { signout } = useContext(AuthContext);
  const { clearWorksites, resetCurrentWorksite } = useContext(WorksiteContext);
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  // käytetään tätä uloskirjautumiseen
  const handleSignout = async () => {
    clearWorksites(); // pyyhitään työmaatiedot statesta
    clearCompany(); // pyyhitään company tiedot statesta
    resetCurrentWorksite();
    signout(); // Kutsutaan signout functio
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#f48b28",
          tabBarInactiveTintColor: "#a3845c",
          tabBarStyle: {
            backgroundColor: "#351301",
          },

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Profile" || route.name === "Profiili") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Main page" || route.name === "Etusivu") {
              iconName = focused ? "home" : "home-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },

          // activeTintColor: "tomato", // väri kun välilehti on aktiivinen
          // inactiveTintColor: "white",
        })}
      >
        <Tab.Screen name={t("main-page")} component={Etusivu} options={{ headerShown: false }} />
        <Tab.Screen name={t("profile")} component={ProfileScreen} options={{ headerShown: false }} />
        <Tab.Screen
          name="More"
          component={DummyComponent} // Dummy-komponentti, koska tämä tabi avaa vain modalin
          options={{
            tabBarButton: () => <MoreTabButton onPress={() => setModalVisible(true)} />,
          }}
        />
      </Tab.Navigator>

      <MoreTabModal isVisible={modalVisible} onClose={() => setModalVisible(false)} onLogout={handleSignout} />
    </>
  );
}

const DummyComponent = () => <View />;


export default HomeTabsNavigator;