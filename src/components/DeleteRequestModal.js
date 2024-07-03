import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DownloadScreen from "./DownloadScreen";
import { Ionicons } from "@expo/vector-icons";
import { color } from "react-native-elements/dist/helpers";


const DeleteRequestModal = ({isVisible, onClose, title, text,setTitle, setText, onSubmit}) => {

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false)




    if (isLoading) {
        return (
            <DownloadScreen message={t('loading')} />
        )
    }


    return (
        <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>

            <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                    
                    <View style={styles.modalView}>
                        <View>
                            <Text style={styles.title}>{t('deleteRequestModal-title')}</Text>
                            <Text style={styles.text}>{t('deleteRequestModal-text')}</Text>
                        </View>
                                
                                    <View style={styles.inputView}>
    
                                        <TextInput 
                                            style={styles.titleInput}
                                            placeholder={t('title')}
                                            value={title}
                                            onChangeText={setTitle}
                                            editable={true}
                                        />

                                        <TextInput 
                                            style={styles.bodyInput}
                                            placeholder={t('text')}
                                            value={text}
                                            onChangeText={setText}
                                            editable={true}
                                            multiline={true}
                                            textAlignVertical="top"
                                        />
                                    </View>
                                    <View style={styles.buttonView} >
                                        <Button style={{color:'white'}} title={t('send')} onPress={onSubmit}/>
                                    </View>
                                
                            
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#f5f5f5" />
                            </TouchableOpacity>
                        </View>
                    </View>
            </SafeAreaView>

        </Modal>
    )

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems:'center'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        paddingVertical: 35,
        paddingHorizontal: 55,
        width: "90%",
        height: '70%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inputView: {
        flex: 1,
        
        width: '100%',
        padding: 2,
      },
      titleInput: {
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 3,
        padding: 3,
        
      },
      bodyInput: {
        borderWidth: 1,
        padding: 3,
        borderRadius: 3,
        height: '50%'
      },
      buttonView: {
        // backgroundColor: "#d9d9da",
        // padding: 10,
        // borderRadius: 5,
        // marginVertical: 10,
        // // width: "50%",
        // alignItems: "center",
        // alignSelf:'center',
        // shadowColor: "#000",
        // shadowOffset: {
        //   width: 0,
        //   height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
        // flexDirection:'row'
      },
      closeButton: {
        position: "absolute",
        right: 0,
        top: 0,
        padding: 10,
        backgroundColor: "#5656e2",
        borderTopRightRadius: 20,
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
            flexDirection:'row'
      },
      title: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 10,
      }

})

export default DeleteRequestModal;