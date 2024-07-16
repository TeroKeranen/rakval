import { useContext, useState } from "react";
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const ResetRequest = ({navigation}) => {
    const {t} = useTranslation();
    const {state, resetPasswordRequst} = useContext(AuthContext);
    const [email, setEmail] = useState('');

    const handleResetRequest = async () => {

        if (email.includes('@')) {
            try {
                const response = await resetPasswordRequst(email);
                
                if (response && response.success) {
                    Alert.alert(t('succeeded'), t('resetRequest-succesMessage'))
                    navigation.navigate("signin")
                } else {
                    Alert.alert(t('failed'))
                }
            } catch (error) {
                Alert.alert(t('goeswrong'), error);
            }
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>

            <View style={styles.container}>
                <Text style={styles.title}>{t('resetRequest-title')}</Text>
                <TextInput 
                    placeholder={t('resetRequest-placeholder')}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textinput}
                    />
                
                <TouchableOpacity onPress={handleResetRequest} style={styles.button}>
                    <Text style={{ color: "white" }}>{t('resetRequest-button')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        justifyContent: "center",
        marginBottom: 250,
      },
      title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 8
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
})



export default ResetRequest;