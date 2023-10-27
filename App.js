
import "react-native-gesture-handler";
import { useContext } from "react";
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
import { Provider as AuthProvider} from './src/context/AuthContext'
import { useState } from "react";
import { navigationRef } from "./src/navigationRef";


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();




function signIn () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="login" component={SigninScreen} />
    </Stack.Navigator>
  )
}
// Tässä on etusivulla näkyvät alapainikkeet
function EtusivuBottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="testi2" component={TestiScreen} options={{headerShown: false}}/>
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

  const { state, signin } = useContext(AuthContext);
  
  
  
    return (
      <NavigationContainer ref={navigationRef}>
      {state.token == null ? (
          <Stack.Navigator>
            <Stack.Screen name="signup" component={SignupScreen} />
            <Stack.Screen name="signin" component={SigninScreen} />
            {/* <Stack.Screen name="testi" component={EtusivuMain} /> */}
          </Stack.Navigator>
        ) : (
          <Drawer.Navigator>
            <Drawer.Screen name="testi" component={EtusivuBottomTabs} />
            <Drawer.Screen name="Worksites" component={WorksitesBottomTab} />
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




