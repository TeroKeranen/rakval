import { useContext, useEffect } from "react";

import { View, StyleSheet, TouchableOpacity, ScrollView, Alert,SafeAreaView } from "react-native";
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

  

  const handleSignUp = async ({email, password}) => {

    try {
      const response = await signup({email, password});

    
      
      if (response.success) {
        
        Alert.alert(t('signup-alert-vericode-attention'), t('signup-alert-vericode'));
      } else {
        // Handle errors based on the backend response
        if (response.passwordtypeError) {
          Alert.alert("Error", t('register-passregexErr'));
        } else if (response.existingUser) {
          Alert.alert("Error", t('signup-userExist'));
        } else {
          Alert.alert("Error", t('fail'));
        }
      }
      
    } catch (error) {
      const errorData = JSON.parse(error.message);

      console.error("Signup error:", error);
      Alert.alert("Network Error", "Unable to connect to server.");
    }
    
  }

 

  return (
    <>
    <SafeAreaView style={{flex: 1}}>

    <ScrollView>

      <View style={styles.container}>
        {/* signup */}
        <AuthForm headerText={t("sign-upHeader")} errorMessage={state.errorMessage} submitButtonText={t("sign-upHeader")} onSubmit={handleSignUp} />
        <NavLink text={t('adminRegister')} routeName="signupAdmin" />
        <NavLink text={t("signup-navlink-text")} routeName="signin" />
      </View>
    
    </ScrollView>
    </SafeAreaView>
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
