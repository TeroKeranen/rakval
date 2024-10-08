import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SigninScreen from "../screens/SigninScreen";
import SignupScreen from "../screens/SignupScreen";
import VerificationScreen from "../screens/VerificationScreen";
import SignupScreenAdmin from "../screens/SignupScreenAdmin";
import ResetRequest from "../screens/resetRequest";


const Stack = createNativeStackNavigator();

const SignedOutNavigator = () => {
  
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="signin" component={SigninScreen} />
      <Stack.Screen name="signup" component={SignupScreen} />
      <Stack.Screen name="signupAdmin" component={SignupScreenAdmin} />
      <Stack.Screen name="resetpassword" component={ResetRequest} />
      
      
      
      
      {/* muut ruudut, jos niitä on */}
    </Stack.Navigator>
  );
};

export default SignedOutNavigator;
