import { useState } from 'react';
import { StyleSheet, View } from 'react-native'
import {Text, Button, Input} from 'react-native-elements'
import { useTranslation } from "react-i18next";


const AuthForm = ({ headerText, errorMessage, onSubmit, submitButtonText }) => {

    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
           <Button title={submitButtonText} onPress={() => onSubmit({email, password})} />
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