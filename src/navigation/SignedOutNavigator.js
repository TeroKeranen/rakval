import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SigninScreen from "../screens/SigninScreen";
import SignupScreen from "../screens/SignupScreen";


const Stack = createNativeStackNavigator();

const SignedOutNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="signin" component={SigninScreen} />
      <Stack.Screen name="signup" component={SignupScreen} />
      
      
      {/* muut ruudut, jos niitä on */}
    </Stack.Navigator>
  );
};

export default SignedOutNavigator;
