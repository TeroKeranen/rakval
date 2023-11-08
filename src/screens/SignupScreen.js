import { useContext, useEffect } from "react";

import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import {Context as AuthContext} from '../context/AuthContext'
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";

const SignupScreen = ({navigation}) => {

  const { t } = useTranslation();
  const { state, signup, clearErrorMessage, tryLocalSignin } = useContext(AuthContext);
  
  // useEffect(() => {
  //   tryLocalSignin();
  // }, [])

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
        <AuthForm headerText={t("sign-upHeader")} errorMessage={state.errorMessage} submitButtonText={t("sign-upHeader")} onSubmit={signup} />
        <NavLink text={t("signup-navlink-text")} routeName="signin" />
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
