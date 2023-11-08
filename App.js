
import './services/i18n'
import "react-native-gesture-handler";
import { useContext, useState, useEffect } from "react";
import { Context as AuthContext } from "./src/context/AuthContext";
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
import AdminScreen from "./src/screens/adminScreens/AdminScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import { Provider as AuthProvider} from './src/context/AuthContext'
import {Provider as WorksiteProvider} from './src/context/WorksiteContext'
import {Provider as CompanyProvider} from './src/context/CompanyContext'
import {Ionicons} from '@expo/vector-icons'
import {Context as CompanyContext} from './src/context/CompanyContext'



import { navigationRef } from "./src/navigationRef";




const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();



// Tämä näytetään etusivulla
function HomeTabs() {
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

          if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "AloitusSivu") {
            iconName = focused ? "home" : "home-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },

        // activeTintColor: "tomato", // väri kun välilehti on aktiivinen
        // inactiveTintColor: "white",
      })}
    >
      <Tab.Screen name="AloitusSivu" component={Etusivu} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function AdminWorksiteTabNoCompany() {
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
      <Tab.Screen name="Työmaat" component={WorkSite} options={{ headerShown: false }} />
      <Tab.Screen name="add new" component={AddNewWorksite} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

//userin worksitetab
function UserWorksiteTabs() {
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
      <Tab.Screen name="Työmaat" component={WorkSite} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Adminille näkyvät alatabit
function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Tab.Screen name="admin" component={AdminScreen} />
    </Tab.Navigator>
  )
}

//mUUTOS 3.11
function MainDrawer () {

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
          <Drawer.Screen name="etusivu" component={HomeTabs} />
          <Drawer.Screen name="työmaat" component={hasCompany ? AdminWorksiteTabs : AdminWorksiteTabNoCompany} />
          {/* <Drawer.Screen name="työmaat" component={AdminWorksiteTabs} /> */}
          <Drawer.Screen name="Oikeudet" component={AdminTabs} />
          
        </>
      ) : (
        <>
          <Drawer.Screen name="etusivu" component={HomeTabs} />
          <Drawer.Screen name="työmaat" component={UserWorksiteTabs} />
        </>
      )}
    </Drawer.Navigator>
   )
  
}
//MUUTOS 3.11


// Päänäkymä joosa katsotaan onko käyttäjä admin vai normi user
function MainStack() {
 
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#351301",  },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen name="MainDrawer" component={MainDrawer} />
      <Stack.Screen
        name="WorksiteDetails"
        component={WorksiteDetails}
        options={{
          headerShown: true,
          headerTitle: "Työmaan tiedot",
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





