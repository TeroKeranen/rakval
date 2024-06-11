import { useContext, useState } from 'react';
import { Context as AuthContext } from "../context/AuthContext";
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { useTranslation } from "react-i18next";




const AuthForm = ({ headerText, errorMessage, onSubmit, submitButtonText}) => {

    const { t } = useTranslation();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {state, setUserEmail} = useContext(AuthContext)
    

    // setUserEmail on sitä varten jos käyttäjä ei heti syötä signupin yhteydessä verification koodia, vaan menee signin kautta
    const handleSubmit = async ()  => {
      // setUserEmail(email);
      
      // try {
        
        const result = await onSubmit({email, password})
      // } catch (error) {
        
      // }
        
        // if (result.success) {
        //   Alert.alert("onnistui");
        // } else {
        //   Alert.alert("Jotain meni vikaan");
        // }
    }
    return (
        <>
        <Text h3 style={styles.text}>{headerText}</Text>
           <TextInput 
            placeholder={t('email')} 
            value={email} 
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.textinput}
            />
           <TextInput
            secureTextEntry
            placeholder={t('password')}
            value={password} 
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.textinput}
            />
            {/* {errorMessage ? <Text style={styles.errorMessage}>{t('goeswrong')}</Text> : null} */}
            
           {/* <Button title={submitButtonText} onPress={handleSubmit} /> */}
           <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={{ color: "white" }}>{submitButtonText}</Text>
            </TouchableOpacity>
        </>
    )

}


const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    alignSelf: "center",
    marginBottom: 50,
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
  },
  textinput: {
    marginVertical: 10,
        borderWidth: 1,
        borderRadius: 3,
        padding: 5,
  },
  button: {
    backgroundColor: "#507ab8",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    // width: "50%",
    alignItems: "center",
    alignSelf:'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default AuthForm;