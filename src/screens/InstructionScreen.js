import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InstructionsAdmin from "../components/InsctructionsAdmin";
import InstructionUser from "../components/InstructionUser";


const InstructionScreen = () => {

    const {t} = useTranslation();

    const [showAdmin, setShowAdmin] = useState(false);
    const [showUser, setShowUser] = useState(false);

    // näytetään admin ohjeet
    const handleAdminShow = () => {
        setShowUser(false);
        setShowAdmin(prevState => !prevState);
    }

    // näytetään normi käyttäjän ohjeet
    const handleUserShow = () => {
        setShowAdmin(false);
        setShowUser(prevState => !prevState);
    }

    return (
        <ImageBackground
            source={require('../../assets/logo-color.png')}
            style={styles.background}
        >
            <SafeAreaView style={{flex: 1}}>

                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <View style={styles.buttons}>
                            <TouchableOpacity onPress={handleAdminShow} style={[styles.button, showAdmin ? styles.selectedButton : null]}>
                                <Text style={[styles.buttonText, showAdmin ? styles.selectedButtonText : null]}>{t('adminInfoTitle1')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleUserShow} style={[styles.button, showUser ? styles.selectedButton : null]}>
                                <Text style={[styles.buttonText, showUser ? styles.selectedButtonText : null]}>{t('userInfoTitle1')}</Text>
                            </TouchableOpacity>
                        </View>
                            <View style={styles.textContainer}>

                                {showAdmin && (
                                    <InstructionsAdmin />
                            
                                )}

                                {showUser && (
                                    <InstructionUser />
                                )}
                            </View>
                    </View>
                </View>

            </SafeAreaView>
        </ImageBackground>
    )

}

const phoneHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    background: {
        flex: 1, // Varmista, että ImageBackground täyttää koko näytön
        width: '100%',
        height: '100%',
      },
      overlay: {
        flex: 1,
        backgroundColor: 'rgba(40, 42, 54, 0.1)',
      },
      container: {
        flex: 1,
        height: phoneHeight,
        

      },
      button: {
        backgroundColor: "#74777c",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: "center",
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'row',

      },
      textContainer: {
        
        flex: 1,
        alignItems: 'center'
      },
      selectedButton: {
        backgroundColor: "#507ab8",
      },
      buttonText: {
        color: 'white',
      },
      selectedButtonText: {
        color: '#ffffff',
      },


      buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
      },



      contentContainer: {}

})



export default InstructionScreen;