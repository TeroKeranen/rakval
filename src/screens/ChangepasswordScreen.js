import { StyleSheet, Text, View,TouchableOpacity, TextInput, Alert } from "react-native";
import {Context as AuthContext} from '../context/AuthContext'
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import DownloadScreen from "../components/DownloadScreen";
import { Ionicons } from "@expo/vector-icons";

const ChangepasswordScreen = ({navigation}) => {

    return (
        <View>
            <Text>jou</Text>
        </View>
    )

    // const { t } = useTranslation();
    // const {state: authState, changePassword,clearErrorMessage} = useContext(AuthContext);
    // const [oldPassword, setOldPassword] = useState('');
    // const [newPassword, setNewPassword] = useState('');
    // const [confirmNewPassword, setConfirmNewPassword] = useState('');
    // const [isLoading, setIsLoading] = useState(false);

    // const handleGoBack = () => {
    //     navigation.navigate("ProfileStack")
    //     clearErrorMessage();
    // }

    // // const handlePasswordChange = () => {
    // //     if (newPassword !== confirmNewPassword) {
    // //         Alert.alert("error", "salasanat eivät täsmää");
    // //         return ;
    // //     }
    // //     changePassword({oldPassword, newPassword})

    // // }

    // const handlePasswordChange =  async ()  => {
    //     setIsLoading(true);
    //     if (newPassword !== confirmNewPassword) {
    //         Alert.alert("Error", t('changePasswordScreenAlertWithPasswords'));
    //         setIsLoading(false);
    //         return;
    //     }
    //     const result = await changePassword({oldPassword, newPassword});

    //     if (result.success) {
    //         Alert.alert(t('changePasswordScreenAlertSuccessTitle'), t('changePasswordScreenAlertSuccess'));
    //         setIsLoading(false);
    //         setOldPassword('');
    //         setNewPassword('');
    //         setConfirmNewPassword('')
    //         return;
    //     } else {
    //         Alert.alert("Error", t('changePasswordScreenAlertFailed'));
    //         setIsLoading(false);
    //         return;
    //     }
    // }
    
    // if (isLoading) {
    //     return <DownloadScreen message={t('loading')} />
    // }

    // return (
    //     <View style={styles.container}>
    //         <View style={styles.allItems}>

            
    //         <View style={styles.goback}>
    //             <TouchableOpacity onPress={handleGoBack} style={styles.button}>
    //                 <Ionicons name="arrow-back-outline" size={20} color={'white'} />
    //                 <Text style={{color: 'white'}}>{t('changePasswordScreenGoBack')}</Text>
    //             </TouchableOpacity>
    //         </View>
    //         {/* {authState.errorMessage ? <Text style={{color: 'red', fontWeight: 'bold'}}>{authState.errorMessage}</Text> : null} */}
    //         <View style={styles.inputContainer}>

    //             <View style={styles.addCompanyInfoCard}>
                    
    //                 <TextInput 
    //                     secureTextEntry
    //                     value={oldPassword}
    //                     placeholder={t('changePasswordScreenPhCurrentPass')}
    //                     onChangeText={setOldPassword}
    //                     style={styles.input}
                        
    //                     />

                    
    //                 <TextInput 
    //                     secureTextEntry
    //                     value={newPassword}
    //                     placeholder={t('changePasswordScreenPhNewPass')}
    //                     onChangeText={setNewPassword}
    //                     style={styles.input}
                        
    //                     />

                    
    //                 <TextInput 
    //                     secureTextEntry
    //                     value={confirmNewPassword}
    //                     placeholder={t('changePasswordScreenPhConfirmNewPass')}
    //                     onChangeText={setConfirmNewPassword}
    //                     style={styles.input}
                        
    //                     />

    //                 <TouchableOpacity onPress={handlePasswordChange} style={styles.button}>
    //                     <Text style={{color: 'white'}}>Change password</Text>
    //                 </TouchableOpacity>
    //             </View>
    //         </View>
    //         </View>
    //     </View>
    // )

}


const styles = StyleSheet.create({
    // container: {
        
    // },
    // allItems: {
    //     width: '90%',
    //     alignSelf: 'center'
    // },
    // inputContainer: {
    //     alignItems: 'center'
    // },
    // goback: {
        
    //     alignSelf: 'flex-start',
    //     padding: 10,
    // },
    // button:{
    //     backgroundColor: "#507ab8",
    //     padding: 10,
    //     borderRadius: 5,
    //     marginVertical: 10,
    //     // width: "50%",
    //     alignItems: "center",
    //     alignSelf:'center',
    //     shadowColor: "#000",
    //     shadowOffset: {
    //       width: 0,
    //       height: 2,
    //     },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 4,
    //     elevation: 5,
    //     flexDirection:'row'
    //     },
    // input: {

    //     height: 40,
    //     width: '60%',
    //     borderRadius: 5,
    //     borderColor: "gray",
    //     alignSelf: 'center',
    //     borderWidth: 1,
    //     marginTop: 10,
    //     marginBottom: 10,
    //     paddingLeft: 8,
    // },
    // addCompanyInfoCard: {
    //     backgroundColor: "#e8e8f0",
    //     width: "100%",
    //     padding: 20,
    //     borderRadius: 10,
    //     shadowColor: "#000",
    //     shadowOffset: {
    //       width: 0,
    //       height: 2,
    //     },
    //     shadowOpacity: 0.15,
    //     shadowRadius: 3.84,
    //     elevation: 5,
    //   },
})

export default ChangepasswordScreen;