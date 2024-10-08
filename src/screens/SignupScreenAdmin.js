import { Alert, ScrollView, StyleSheet, Text, View, SafeAreaView } from "react-native";
import NavLink from "../components/NavLink";
import { useTranslation } from "react-i18next";
import AuthFormAdmin from "../components/AuthFormAdmin";
import { Context as AuthContext } from "../context/AuthContext";
import { useContext } from "react";


const SignupScreenAdmin = () => {

    const { t } = useTranslation();
    const { state, signup, clearErrorMessage, tryLocalSignin,adminSignup } = useContext(AuthContext);

    const handleAdminSignUp = async ({email, password, role, companyDetails}) => {

      try {
        
        const response = await adminSignup({email, password, role,companyDetails})

       
        
        if (response.success) {
          Alert.alert(t('signup-alert-vericode-attention'), t('signup-alert-vericode'));
        } else if (response.existingUser) {
          Alert.alert(t('signup-userExist'))
        } else if (response.invalidData) {
          Alert.alert(t('signup-missingDataError'));
        } else if (response.passwordtypeError) {
          Alert.alert("Error", t('register-passregexErr'));
        } else {
          Alert.alert(t('fail'))
        }
      } catch (error) {
        // const errorData = JSON.parse(error.message);
        
        Alert.alert(t('fail'))
      }
    }


    return (
        <SafeAreaView style={{flex: 1}}>
        <ScrollView>
    
          <View style={styles.container}>
            {/* signup */}
            {/* <AuthForm headerText={t("sign-upHeader")} errorMessage={state.errorMessage} submitButtonText={t("sign-upHeader")} onSubmit={handleSignUp} /> */}
            <AuthFormAdmin headerText={t("sign-upAdminHeader")} errorMessage="tyhjä" submitButtonText={t("sign-upHeader")}  onSubmit={handleAdminSignUp}/>
            <NavLink text={t('standardRegister')} routeName="signup" />
            <NavLink text={t("signup-navlink-text")} routeName="signin" />
          </View>
        </ScrollView>
        </SafeAreaView>
      );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 40,
        justifyContent: 'center',
        marginBottom: 250,
        
      },

})


export default SignupScreenAdmin;