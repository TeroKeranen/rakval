import { useContext, useEffect } from "react";

import { View, StyleSheet, TouchableOpacity } from "react-native";

import {Context as AuthContext} from '../context/AuthContext'
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";

const SignupScreen = ({navigation}) => {
  const { state, signup, clearErrorMessage } = useContext(AuthContext);
  // const navigation = useNavigation();

  // Käytetään tätä tyhjentämään errormessage jos tulee virhe ja vaihdetaan toiselle sivulle, Näin virhe ei seuraa mukana
  useEffect(() => {
    const focus = navigation.addListener("focus", clearErrorMessage);

    const blur = navigation.addListener("blur", clearErrorMessage);

    return () => {
      focus();
      blur();
    };
  }, [navigation]);

  return (
    <>
      <View style={styles.container}>
        {/* signup */}
        <AuthForm headerText="Sign Up" errorMessage={state.errorMessage} submitButtonText="Sign Up" onSubmit={signup} />
        <NavLink text="Sinulla on jo luotu tili? Kirjaudu sisään sittenkin" routeName="signin" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
    marginBottom: 250,
    
  },
  
  

})



export default SignupScreen;
