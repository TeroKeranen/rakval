
import './services/i18n'
import "react-native-gesture-handler";
import { useContext, useState, useEffect } from "react";
import { Context as AuthContext } from "./src/context/AuthContext";
import { StatusBar } from 'expo-status-bar';



import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'



import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import { Provider as AuthProvider} from './src/context/AuthContext'
import {Provider as WorksiteProvider} from './src/context/WorksiteContext'
import {Provider as CompanyProvider} from './src/context/CompanyContext'
import {Provider as EventsProvider} from './src/context/EventsContext'

import { useTranslation } from "react-i18next";

// Navigations
import SignedOutNavigator from './src/navigation/SignedOutNavigator'
import MainDrawerNavigator from './src/navigation/MainDrawerNavigator';
import WorksiteDetailsTabsNavigator from './src/navigation/WorksiteDetailTabsNavigator';

//AWS
import { Amplify } from "aws-amplify";
import awsExports from "./src/aws-exports";

Amplify.configure(awsExports);



const Stack = createNativeStackNavigator();



// päästack 
function MainStack() {

  const { state, tryLocalSignin, fetchUser } = useContext(AuthContext); // Otetaan trylocalSignin Autcontext.js sisältä
 
  const { t } = useTranslation();

  // useEffect(() => {
    
  //   const checkAuthState = async () => {
      
  //     await fetchUser();
      
  //   };
  //   checkAuthState();
  // }, []);
  return (
    
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#282A36" },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen name="MainDrawer" component={MainDrawerNavigator} />
      <Stack.Screen
        name="WorksiteDetails"
        component={WorksiteDetailsTabsNavigator}
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
  // const { state, tryLocalSignin, fetchUser } = useContext(AuthContext);
  // const isVerified = state?.user?.isVerified;
  
  
  

  return (
    

    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      {/* <Stack.Screen name="veri" component={FeriviedUser} /> */}
      <Stack.Screen name="Main" component={MainStack} />
      {/* muut ruudut, jos niitä on */}
      
    </Stack.Navigator>
    
  );

}


function App() {
  
  const { state, tryLocalSignin, fetchUser } = useContext(AuthContext); // Otetaan trylocalSignin Autcontext.js sisältä
  const [loading, setLoading] = useState(true); // asetetaan loading
  
  // const isVerified = state?.user?.isVerified;
  

  useEffect(() => {
    
    const checkAuthState = async () => {
      await tryLocalSignin();
      // await fetchUser();
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
          <EventsProvider>
            <App />
          </EventsProvider>
        </CompanyProvider>
      </WorksiteProvider>
    </AuthProvider>
  )
}





