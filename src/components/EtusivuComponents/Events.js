import { Text, View, StyleSheet, FlatList,RefreshControl, TextInput, SafeAreaView, Dimensions, Alert, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import {useContext, useEffect, useState} from 'react';

import { Context as EventContext } from "../../context/EventsContext";
import {timeStampChanger} from '../../utils/timestampChanger'
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";




const Events = ({events, modalVisible, onClose}) => {


  
  const {state: eventState,fetchEvents } = useContext(EventContext) 
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isRefreshing, setIsRefreshing] = useState(false);
  const currentLang = i18n.language; // Otetaan käytetty kieli talteen


  // Käytetään tätä etusivun haku toiminnossa apuna
  const translateEventType = (type) => {
    switch (type) {
      case 'work-start':
        if (currentLang === "fi") {

          return 'työ aloitettu';
        } else {
          return 'Work started'
        }
      case 'work-end':
        if (currentLang === "fi") {

          return 'työ lopetettu';
        } else {
          return 'Work completed'
        }
      case 'added-marker':
        if (currentLang === "fi") {

          return 'lisätty merkki';
          
        } else {
          return 'Added marker'
        }
      case 'added-calendarmark':
        if (currentLang === "fi") {

          return 'Lisätty kalenteri merkki';
        } else {
          return 'Added calendar mark'
        }
        
      case 'deleted-calendarmark':
        if (currentLang === "fi") {

          return 'Poistettu kalenteri merkki'
        } else {
          return 'Deleted calendar mark'
        }
        
      // Lisää muita tapauksia tarvittaessa
      default:
        return type;
    }
  };

  // Käytetään onRefresh funktiota flatlistissä
  const onRefresh = () => {
    setIsRefreshing(true); // Aseta päivitystila todeksi
    fetchEvents().then(result => {
      
      setIsRefreshing(false); // Aseta päivitystila epätodeksi, kun olet valmis
    })
    .catch(error => {
      
      setIsRefreshing(false); // Aseta päivitystila epätodeksi, jos tulee virhe
    });
  }

  const displayEvents = searchTerm.length === 0
    ? events
    : events.filter(event => {
      const translatedType = translateEventType(event.type).toLowerCase();
      return (
        event.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.worksite.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        translatedType.includes(searchTerm.toLocaleLowerCase()) ||
        timeStampChanger(event.timestamp).includes(searchTerm)

        // Lisää muita suodatusehtoja tarpeen mukaan
      );
    })

    const handleTouchableWithoutFeedback = () => {
      
      Keyboard.dismiss();
  }

    return (
      <Modal 
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

            style={{ flex: 1 }}>
        <SafeAreaView style={{flex:1}}>

        <View style={styles.mainContainer}>

        <TouchableWithoutFeedback onPress={handleTouchableWithoutFeedback}>
          <View style={styles.textinputContainer}>
            <Ionicons name="options" size={25} color="black" />
            <TextInput
              placeholder={t('search')}
              placeholderTextColor="white"
              style={styles.textinput}
              value={searchTerm}
              onChangeText={text => setSearchTerm(text)}
              />
          </View>
              </TouchableWithoutFeedback>

            <FlatList
              
              data={displayEvents}
              contentContainerStyle={{paddingBottom: 200}}
              refreshing={isRefreshing}  // Päivitysindikaattorin tila
              onRefresh={onRefresh}      // Päivitysmetodi
              keyExtractor={(item) => item._id}
              renderItem={({item}) => {
                let displayText;
                
                switch (item.type) {
                  case 'added-marker':
                    if (currentLang === "fi") {
                      
                      displayText ='Lisätty merkki';
                      
                    } else {
                      displayText = 'Added marker'
                    }      
                    break;
                    
                    case 'update-marker':
                      if (currentLang === "fi") {
                        
                        displayText ='Merkkiä muokattu';
                        
                      } else {
                        displayText = 'Updated marker'
                      }   
                      
                      break;
                      case 'work-start':
                        if (currentLang === "fi") {
                          
                          displayText = 'Työ aloitettu';
                          
                        } else {
                          displayText = 'Work started'
                        }
                        break;
                        case 'work-end':
                    if (currentLang === "fi") {
                      
                      displayText = 'Työ lopetettu';
                      
                    } else {
                      displayText = 'Work completed'
                    }   
                    
                    break;
                    case 'remove-marker':
                      if (currentLang === "fi") {
                        
                        displayText = "Merkki poistettu";
                        
                      } else {
                        displayText = 'Deleted marker'
                      }   
                      
                      break;
                      case 'added-calendarmark':
                        if (currentLang === "fi") {
                          
                          displayText = "Lisätty kalenteri merkki";
                          
                        } else {
                          displayText = 'Added calendar marker'
                        }   
                        
                        break;
                        case 'updated-calendarmark':
                    if (currentLang === "fi") {

                      displayText = "Muokattu kalenteri merkki";
                      
                    } else {
                      displayText = 'Updated calendar marker'
                    }   
                    
                    break;
                    case 'deleted-calendarmark':
                      if (currentLang === "fi") {

                        displayText = "Poistettu kalenteri merkki"
                      
                      } else {
                        displayText = 'Deleted calendar marker'
                      }   
                      
                      break;
                      default:
                        displayText = item.type;
                  }
                  
                  return (
                    
                    <View style={styles.eventContainer}>

                    
                      <View style={styles.type}>
                        {item.markerNumber ?
                          <Text style={styles.text}>{displayText} ({item.markerNumber})</Text>
                          : <Text style={styles.text}>{displayText}</Text>
                        }
                        
                        <Text style={styles.text}>{timeStampChanger(item.timestamp)}</Text>
                      </View>

                      <Text style={styles.text}>{t('constructionSite')}: {item.worksite.address}</Text>
                      {item.calendarDate && 
                        <Text style={styles.text}>{t('date')}: {item.calendarDate}</Text>
                      }
                      <Text style={styles.text}>{t('user')}: {item.user?.email}</Text>
                    

                </View>
                )
              }}
              ListEmptyComponent={() => (
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyListText}>ei dataa</Text>
                </View>
              )}
              refreshControl={
                <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor="white" // Asettaa päivitysindikaattorin värin valkoiseksi
                />
              }
              
              />
        

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#f5f5f5" />
          </TouchableOpacity>

        </View>

      </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
    )

}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
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
  text: {
      color: "black",
      fontSize: 16,
    },
    eventContainer: {
      alignSelf: 'center',
      backgroundColor: '#ddd4d4',
      width: '100%',
      marginVertical: 6,
      padding: 10,
      borderRadius: 10,
      elevation: 3,
      shadowColor: "black",
      shadowRadius: 4,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.4,
  
    },
    
    type: {
      flexDirection: 'row',
      justifyContent:'space-between',
      marginBottom: 10,
  
    },
    emptyListContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    emptyListText: {
      fontSize: 16,
      color: 'grey',
    },
    textinputContainer: {
      marginVertical: 10,
      padding: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 5,
      width: '90%',
      alignSelf: 'center'
    },
    textinput: {
      padding: 3,
      color: '#000000',
      width: '100%'
    },
    closeButton: {
      position: "absolute",
      right: 0,
      top: 0,
      padding: 10,
      backgroundColor: "#5656e2",
      borderTopRightRadius: 20,
    },
  });



export default Events