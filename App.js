
import "react-native-gesture-handler";
import { useContext, useState, useEffect } from "react";
import { Context as AuthContext } from "./src/context/AuthContext";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./src/screens/ProfileScreen";
import WorkSite from './src/screens/workisiteScreens/WorkSite';
import TestiScreen from './src/screens/TestiScreen';
import AddNewWorksite from './src/screens/workisiteScreens/AddNewWorksite';
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import AdminScreen from "./src/screens/AdminScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import { Provider as AuthProvider} from './src/context/AuthContext'

import { navigationRef } from "./src/navigationRef";


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();




function AdminNavigation () {
  return (
    <Tab.Navigator>
      <Tab.Screen name="worksites" component={WorkSite} />
      <Tab.Screen name="addnew" component={AddNewWorksite} />
      <Tab.Screen name="admin" component={AdminScreen} />
    </Tab.Navigator>
  );
}


// Tässä on etusivulla näkyvät alapainikkeet
function EtusivuBottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="testi2" component={TestiScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}



// Tässä on workistes sivulla näkyvät alapainikkeet
function WorksitesBottomTab () {
  return (
    <Tab.Navigator>
      <Tab.Screen name="worksites" component={WorkSite}/>
      <Tab.Screen name="addnew" component={AddNewWorksite}/>
    </Tab.Navigator>
  )
}

function EtusivuMain() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Etusivu" component={EtusivuBottomTabs} />
      <Drawer.Screen name="Worksites" component={WorksitesBottomTab} />
    </Drawer.Navigator>
  );
}



function App() {

  const { state, tryLocalSignin } = useContext(AuthContext); // Otetaan trylocalSignin Autcontext.js sisältä
  const [loading, setLoading] = useState(true); // asetetaan loading

 
  useEffect(() => {

    const checkAuthState = async () => {
      await tryLocalSignin();
      setLoading(false);
    }
    checkAuthState();

  },[])

  // Jos löytää käyttäjän niin se näyttää tämän sivun supernopeasti ennenkuin siirtyy pääsivulle

  if (loading) {
    return <ResolveAuthScreen />
  }
  
  
    return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Screen name="resolveAuth" component={ResolveAuthScreen} />
      {state.token == null ? (
          <Stack.Navigator>
            <Stack.Screen name="signin" component={SigninScreen} />
            <Stack.Screen name="signup" component={SignupScreen} />
            {/* <Stack.Screen name="testi" component={EtusivuMain} /> */}
          </Stack.Navigator>
        ) : (
          <Drawer.Navigator>
            {state.user && state.user.role === 'admin' ? (
              <>
              <Drawer.Screen name="etusivu" component={EtusivuBottomTabs} />
              <Drawer.Screen name="Worksites" component={WorksitesBottomTab} />
              <Drawer.Screen name="admin" component={AdminScreen} />
              </>
            ) : (
              <>
              <Drawer.Screen name="etusivu" component={EtusivuBottomTabs} />
              <Drawer.Screen name="Worksites" component={WorksitesBottomTab} />
              </>
            
            )}
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    );

}

export default () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}




