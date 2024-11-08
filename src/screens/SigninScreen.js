import { Text, View, StyleSheet,FlatList, ScrollView, Alert, SafeAreaView, Dimensions } from "react-native";
// import i18next from '../../services/i18n'
import { useTranslation } from "react-i18next";

import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";
import { useContext, useEffect } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import ChangeLanguage from "../components/ChangeLanguage";


const windowHeight = Dimensions.get('window').height;

const SigninScreen = ({navigation}) => {

  const {t} = useTranslation();
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

  const handleSigIn = async({email, password}) => {
    
    try {
      const response = await signin({email, password})

      if (response.success) {
        Alert.alert(t('signin-loginSuccess'))
      } else {
        Alert.alert(t('signin-loginFail'))
      }
     
      
    } catch (error) {
      
      
      // Alert.alert(t('goeswrong'))
    }

  }

  
  
  return (
    <SafeAreaView style={{flex: 1}}>
    
    <ScrollView>

      <View style={styles.container}>
        {/* signin */}

        <View style={styles.signInBox}>
          <AuthForm headerText={t("signinHeader")} errorMessage={state.errorMessage} submitButtonText={t('signinHeader')}  onSubmit={handleSigIn} />
          <NavLink text={t("signin-navlink-text")} routeName="signup" />
          <NavLink text={t('signin-forgotpassword')} routeName="resetpassword" />
        </View>

        <View style={styles.languageBox}>
          <ChangeLanguage />
        </View>
      </View>
    </ScrollView>
    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    padding: 40,
    justifyContent: "center",
    marginBottom: 250,
    
  },
  languageBox: {
    flex: 1, 
    marginVertical: 40,
  },
 
});

export default SigninScreen;
