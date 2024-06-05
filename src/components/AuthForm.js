import { useContext, useState } from 'react';
import { Context as AuthContext } from "../context/AuthContext";
import { Alert, StyleSheet, View } from 'react-native'
import {Text, Button, Input} from 'react-native-elements'
import { useTranslation } from "react-i18next";




const AuthForm = ({ headerText, errorMessage, onSubmit, submitButtonText}) => {

    const { t } = useTranslation();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {state, setUserEmail} = useContext(AuthContext)
    

    // setUserEmail on sitä varten jos käyttäjä ei heti syötä signupin yhteydessä verification koodia, vaan menee signin kautta
    const handleSubmit = async ()  => {
      // setUserEmail(email);
      console.log("autform", email);
      // try {
        
        const result = await onSubmit({email, password})
      // } catch (error) {
        
      // }
        // console.log("result", result);
        // if (result.success) {
        //   Alert.alert("onnistui");
        // } else {
        //   Alert.alert("Jotain meni vikaan");
        // }
    }
    return (
        <>
        <Text h3 style={styles.text}>TEKSTITEKSTI</Text>
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
            {/* {errorMessage ? <Text style={styles.errorMessage}>{t('goeswrong')}</Text> : null} */}
            
           <Button title={submitButtonText} onPress={handleSubmit} />
        </>
    )

}


const styles = StyleSheet.create({
  text: {
    alignSelf: "center",
    marginBottom: 50,
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
  },
});

export default AuthForm;