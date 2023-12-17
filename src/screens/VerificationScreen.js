import { useContext, useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View,SafeAreaView,StatusBar } from "react-native";
import { Context as authContext } from "../context/AuthContext";
import { Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";


const VerificationScreen = ({navigation}) => {

    const { t } = useTranslation();
    const {state: authState, verifyEmail,signout } = useContext(authContext)
    const [code, setCode] = useState('');
   

    useEffect(() => {
        
        
    },[authState.user, authState.email])

    

    const verifycode = async () => {
        try {
            
            const result = await verifyEmail({email:authState.email || authState.user.email, verificationCode: code})
            
            if (result.success) {
                Alert.alert(t('verificationSuccessTitle'), t('verificationSuccessText'))
                return;
            } else if (result.success === false) {
                
                Alert.alert(t('error'), t('goeswrong'))
            } 
            
            
        } catch (error) {
            console.log("verificationereror",error);
            
        }

    }

    


    return (
        <View style={styles.container}>
            <View style={styles.infoCard}>

                <View style={styles.goback}>
                    <TouchableOpacity style={styles.button} onPress={() => signout()}>
                        <Ionicons name="arrow-back-outline" size={20} color={'white'} />
                        <Text style={{color: 'white'}}>{t('goBack')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.input}>
                    
                    <Input style={styles.textInput} value={code} onChangeText={setCode} placeholder={t('verificationCode')}/>
   
                    <TouchableOpacity style={styles.button} onPress={verifycode}>
                        
                        <Text style={{color: 'white'}}>{t('verification')}</Text>
                    </TouchableOpacity>
                </View>
                
                
            </View>
        </View>
        
        
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center',
    },
    infoCard: {
        
        backgroundColor: "#e8e8f0",
        width: "90%",
        height: '50%',
        padding: 0,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
      },
      goback: {
        
        alignSelf: 'flex-start',
        padding: 10,
    },
    button:{
        backgroundColor: "#507ab8",
        padding: 10,
        borderRadius: 5,
        marginVertical: 0,
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
        flexDirection:'row'
        },
    input: {
        padding: 30,
    },
    textInput: {

    }

})

export default VerificationScreen;