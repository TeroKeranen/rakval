import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ChangepasswordScreen from '../screens/ChangepasswordScreen'
import ProfileScreen from '../screens/ProfileScreen'




const ProfileStack = createNativeStackNavigator();

const ProfileStackNavigator = () => {

   

    return (
        <ProfileStack.Navigator screenOptions={{headerShown: false}}>

            <ProfileStack.Screen name="ProfileStack" component={ProfileScreen}/>
            <ProfileStack.Screen name="ChangepasswordScreen" component={ChangepasswordScreen} />
            

        </ProfileStack.Navigator>
    )
}


export default ProfileStackNavigator;