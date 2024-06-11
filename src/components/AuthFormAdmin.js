import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Context as AuthContext } from "../context/AuthContext";
import { Button, Input } from "react-native-elements";
import { StyleSheet, Text, View } from "react-native";


const AuthFormAdmin = ({ headerText, errorMessage, onSubmit, submitButtonText}) => {




    const { t } = useTranslation();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
    const [companyCity, setCompanyCity] = useState("");
    const {state, setUserEmail} = useContext(AuthContext)

    
    // setUserEmail on sitä varten jos käyttäjä ei heti syötä signupin yhteydessä verification koodia, vaan menee signin kautta
    const handleSubmit = async ()  => {
      const role = "admin";
        // setUserEmail(email);
        const companyDetails = {
            name: companyName,
            address : companyAddress,
            city: companyCity
        }
        await onSubmit({email, password, role, companyDetails})
        

        
          
          // if (result.success) {
          //   Alert.alert("onnistui");
          // } else {
          //   Alert.alert("Jotain meni vikaan");
          // }
      }
      return (
          <>
          <Text h3 style={styles.text}>{headerText}</Text>
             <Input 
              label={t('email')} 
              value={email} 
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              />
             <Input 
              secureTextEntry
              label={t('password')}
              value={password} 
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}     
              />
              <Input 
                label={t('adminSignUp-companyName')}
                value={companyName}
                onChangeText={setCompanyName}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Input 
                label={t('adminSignUp-companyAddress')}
                value={companyAddress}
                onChangeText={setCompanyAddress}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Input 
                label={t('adminSignUp-companyCity')}
                value={companyCity}
                onChangeText={setCompanyCity}
                autoCapitalize="none"
                autoCorrect={false}

              />
              {/* {errorMessage ? <Text style={styles.errorMessage}>{t('goeswrong')}</Text> : null} */}
              
             <Button title={submitButtonText} onPress={handleSubmit} />
          </>
      )

}

const styles = StyleSheet.create({

    text: {
        alignSelf: "center",
        marginBottom: 50,
        fontSize: 25
      },
      errorMessage: {
        fontSize: 16,
        color: "red",
      },

})



export default AuthFormAdmin;