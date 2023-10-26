import * as React from 'react'
import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {NavigationContainer} from '@react-navigation/native'
import ProfileScreen from "./src/screens/ProfileScreen";
import AddWorksiteScreen from "./src/screens/AddWorksiteScreen";
import { StatusBar } from "expo-status-bar";
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator () {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Worksites" component={AddWorksiteScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    // <>
    //   <StatusBar style="dark" />
    //   <NavigationContainer>
    //     <ProfileScreen />
    //   </NavigationContainer>
    // </>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Drawer" 
          component={DrawerNavigator} 
          options= {{
            title: "Rakval"
          }}
          
          />
          
      </Stack.Navigator>
      
    </NavigationContainer>
    
  )
}

// function MyDrawer () {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen name="profile" component={ProfileScreen}/>
//       <Drawer.Screen name="addworksite" component={AddWorkSite}/>
//     </Drawer.Navigator>
//   )
// }



