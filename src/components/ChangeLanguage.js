
import { Modal, Text, TouchableOpacity, View, FlatList, StyleSheet, SafeAreaView } from "react-native";
import i18next, { languageResources } from "../../services/i18n"
import {useTranslation} from 'react-i18next'
import { useState } from "react";
import languageList from '../../services/languagesList.json'



const ChangeLanguage = () => {
    const {t} = useTranslation();
    const [visible, setVisible] = useState(false);

    const changeLng = (lng) => {
        i18next.changeLanguage(lng);
        setVisible(false);
    }

    return (
        <View>
            <Modal style={styles.modal} visible={visible} onRequestClose={() => setVisible(false)}>
                <SafeAreaView style={{flex:1}}>

                  <View style={styles.modalcontainer}>
                      <FlatList 
                          data={Object.keys(languageResources)} 
                          renderItem={({item}) => (
                            <TouchableOpacity style={styles.modalButton} onPress={() => changeLng(item)}>
                                  <Text style={styles.modalText}>{languageList[item].nativeName}</Text>
                              </TouchableOpacity> 
                              )}/>
                  </View>
                </SafeAreaView>
            </Modal>

            <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
                <Text style={styles.buttonText}>{t('change-language')}</Text>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
  modal: {
    margin: 0, // Voit asettaa marginaalit nollaksi tai säätää ne tarpeen mukaan
    // alignItems: "center",
    // justifyContent: "center",
  },
  modalcontainer: {
    flex: 1,
    backgroundColor: "white", // Taustaväri modalille
    
    padding: 20,
    borderRadius: 10, // Pyöristetyt kulmat
    shadowOpacity: 0.25, // Varjon läpinäkyvyys
    shadowRadius: 3.84, // Varjon säde
    elevation: 5, // Korostus Androidille
  },
  modalButton: {
    backgroundColor: "#F0F0F0", // Napin taustaväri
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1, // Erota napit toisistaan viivalla
    borderBottomColor: "#CCCCCC", // Viivan väri
  },
  modalText: {
    fontSize: 18, // Tekstin koko
    color: "#333333", // Tekstin väri
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
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});


export default ChangeLanguage;