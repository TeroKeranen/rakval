
import './services/i18n'
import "react-native-gesture-handler";
import { useContext, useState, useEffect } from "react";
import { Context as AuthContext } from "./src/context/AuthContext";
import {Context as CompanyContext} from './src/context/CompanyContext'
import { Context as WorksiteContext } from './src/context/WorksiteContext'
import { createDrawerNavigator } from "@react-navigation/drawer";
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./src/screens/ProfileScreen";
import WorkSite from './src/screens/workisiteScreens/WorkSite';
import WorksiteDetails from './src/screens/workisiteScreens/WorksiteDetails'
import Etusivu from "./src/screens/Etusivu";
import AddNewWorksite from './src/screens/workisiteScreens/AddNewWorksite';
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import AdminScreen from "./src/screens/adminScreens/CompanyScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import { Provider as AuthProvider} from './src/context/AuthContext'
import {Provider as WorksiteProvider} from './src/context/WorksiteContext'
import {Provider as CompanyProvider} from './src/context/CompanyContext'
import {Ionicons} from '@expo/vector-icons'
import { useTranslation } from "react-i18next";
import MoreTabButton from './src/components/MoreTabButton';
import MoreTabModal from './src/components/MoreTabModal';



import { navigationRef } from "./src/navigationRef";
import { TouchableOpacity, View } from 'react-native';




const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();



// Tämä näytetään etusivulla
function HomeTabs() {
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

function AdminWorksiteTabNoCompany() {
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
}

// adminin workistetab if admin have a company
function AdminWorksiteTabs() {
  const {t} = useTranslation();
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

          if (route.name === "Add new" || route.name === "Lisää uusi") {
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
      <Tab.Screen name={t("add-new-construction")} component={AddNewWorksite} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

//userin worksitetab
function UserWorksiteTabs() {
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

// Adminille näkyvät alatabit
function AdminTabs() {
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

          if (route.name === "Your company" || route.name === "Sinun yritys") {
            iconName = focused ? "ios-key" : "ios-key";
          } 
          return <Ionicons name={iconName} size={size} color={color} />;
        },

        // activeTintColor: "tomato", // väri kun välilehti on aktiivinen
        // inactiveTintColor: "white",
      })}
    >
      <Tab.Screen name={t("tabScreen-company")} component={AdminScreen} options={{headerShown: false}} />
    </Tab.Navigator>
  );
}

//mUUTOS 3.11
function MainDrawer () {
  const { t } = useTranslation();
  const { state} = useContext(AuthContext);
   
  useEffect(() => {
    // console.log("app.js", state);
  },[state])
   const isAdmin = state.user && state.user.role === 'admin';
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
           <Drawer.Screen name={t("drawerScreen-front-page")} component={HomeTabs} />
           <Drawer.Screen name={t("drawerScreen-worksite")} component={hasCompany ? AdminWorksiteTabs : AdminWorksiteTabNoCompany} />
           {/* <Drawer.Screen name="työmaat" component={AdminWorksiteTabs} /> */}
           <Drawer.Screen name={t("drawerScreen-company")} component={AdminTabs} />
         </>
       ) : (
         <>
           <Drawer.Screen name={t("drawerScreen-front-page")} component={HomeTabs} />
           <Drawer.Screen name={t("drawerScreen-worksite")} component={UserWorksiteTabs} />
         </>
       )}
     </Drawer.Navigator>
   );
  
}
//MUUTOS 3.11


// Päänäkymä joosa katsotaan onko käyttäjä admin vai normi user
function MainStack() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#351301" },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen name="MainDrawer" component={MainDrawer} />
      <Stack.Screen
        name="WorksiteDetails"
        component={WorksiteDetails}
        options={{
          headerShown: true,
          headerTitle: t("woksite-detail-header"),
        }}
      />
    </Stack.Navigator>
  );
}

// Tämä renderöidään appin sisällä jos käyttäjä löytyy
function SignedInNavigator() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="Main" component={MainStack} />
      {/* muut ruudut, jos niitä on */}
    </Stack.Navigator>
  );
}

// Tämä näkyy jos ei ole kirjautunut sisään
function SignedOutNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="signin" component={SigninScreen} />
      <Stack.Screen name="signup" component={SignupScreen} />
      {/* muut ruudut, jos niitä on */}
    </Stack.Navigator>
  );
}

function App() {
  
  const { state, tryLocalSignin, fetchUser } = useContext(AuthContext); // Otetaan trylocalSignin Autcontext.js sisältä
  const [loading, setLoading] = useState(true); // asetetaan loading

  useEffect(() => {
    
    const checkAuthState = async () => {
      await tryLocalSignin();
      setLoading(false);
    };
    checkAuthState();
  }, []);
  
  if (loading) {
    return <ResolveAuthScreen />
  }
  return (
    <NavigationContainer>
      <Stack.Screen name="resolveAuth" component={ResolveAuthScreen} />
      {state.token == null ? <SignedOutNavigator /> : <SignedInNavigator />}
    </NavigationContainer>
  );
}

export default () => {
  return (
    <AuthProvider>
      <WorksiteProvider>
        <CompanyProvider>
          <App />
        </CompanyProvider>
      </WorksiteProvider>
    </AuthProvider>
  )
}





