import { Text, View, StyleSheet } from "react-native";

import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";
import { useContext, useEffect } from "react";
import { Context as AuthContext } from "../context/AuthContext";

const SigninScreen = ({navigation}) => {

  const { state, signin, clearErrorMessage } = useContext(AuthContext);
  

  // Käytetään tätä tyhjentämään errormessage jos tulee virhe ja vaihdetaan toiselle sivulle, Näin virhe ei seuraa mukana
  useEffect(() => {
    const focus = navigation.addListener('focus', clearErrorMessage)

    const blur = navigation.addListener('blur', clearErrorMessage)

    return () => {
      focus();
      blur();
    }
  }, [navigation])
  
  return (
    <>
      <View style={styles.container}>
        {/* signin */}
        <AuthForm headerText="Sign in" errorMessage={state.errorMessage} submitButtonText="Sign In" onSubmit={signin} />
        <NavLink text="Sinulla ei ole tunnusta? Luo itsellesi uusi tunnus" routeName="signup" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: "center",
    marginBottom: 250,
  },
});

export default SigninScreen;
