import { useContext } from "react";
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {calculateTotaWorkTime} from '../../utils/workingHours'
import { useTranslation } from "react-i18next";


const WorksiteReady = ({worksites, title, modalVisible, onClose}) => {

  
    const { t } = useTranslation();


    return (
      <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      >
        <SafeAreaView style={{flex:1}}>

        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          
          {worksites.length < 1 && (
            
            <View style={styles.empthyContainer}>
              <Text style={styles.text}>{t('worksite-no-worksites')}</Text>
            </View>
            )}

          <FlatList
            data={worksites}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{paddingBottom: 200}}
            renderItem={({ item }) => {
              const totalWorkTime = calculateTotaWorkTime(item.workDays);
              return (
                
                <View style={styles.renderContainer}>
                <Text >{t('worksiteform-city')}: {item.city}</Text>
                <Text >{t('worksiteform-address')}: {item.address}</Text>
                {item.startTime && <Text >{t('startingDate')}: {item.startTime}</Text>}
                <Text >{t('workHours')}: {totalWorkTime}</Text>
                
                

                
              </View>
              )
            }}/>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#f5f5f5" />
            </TouchableOpacity>

        </View>
        </SafeAreaView>
        </Modal>
      );
    

}

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: "#333644",
    borderTopLeftRadius: 20, // Pyöristetään vain yläkulmat
    borderTopRightRadius: 20,
    paddingVertical: 35,
    // paddingHorizontal: 55,
    width: "100%",
    height: '100%',
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
 
  title: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '600'
  },
  renderContainer: {
    alignSelf: 'center',
      backgroundColor: '#ddd4d4',
      width: '90%',
      marginVertical: 6,
      padding: 10,
      borderRadius: 10,
      elevation: 3,
      shadowColor: "black",
      shadowRadius: 4,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.4,
    
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 10,
    backgroundColor: "#5656e2",
    borderTopRightRadius: 20,
  },
  empthyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',  // Center the content horizontally
    
  },
  text:{
    color: 'white',
    fontSize: 20,
    
    textAlign: 'center',
  }
})


export default WorksiteReady;