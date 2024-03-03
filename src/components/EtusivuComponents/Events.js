import { Text, View, StyleSheet, FlatList, TextInput, SafeAreaView } from "react-native";
import {useContext, useEffect, useState} from 'react';

import {timeStampChanger} from '../../utils/timestampChanger'
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const Events = ({events}) => {

    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState(''); 

    
  // Käytetään tätä etusivun haku toiminnossa apuna
  const translateEventType = (type) => {
    switch (type) {
      case 'work-start':
        return 'työ aloitettu';
      case 'work-end':
        return 'työ lopetettu';
      case 'added-marker':
        return 'lisätty merkki';
      case 'added-calendarmark':
        return 'Lisätty kalenteri merkki';
      case 'deleted-calendarmark':
        return 'Poistettu kalenteri merkki'
      // Lisää muita tapauksia tarvittaessa
      default:
        return type;
    }
  };


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

    return (
        <View style={styles.mainContainer}>
      <View style={styles.textinputContainer}>
        <Ionicons name="options" size={25} />
        <TextInput
          placeholder="hae..."
          style={styles.textinput}
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          />
      </View>
      <FlatList
        data={displayEvents}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => {
          let displayText;

          switch (item.type) {
            case 'added-marker':
              displayText ='Lisätty merkki';
              break;
            case 'update-marker':
              displayText ='Merkkiä muokattu';
              break;
            case 'work-start':
              displayText = 'Työ aloitettu';
              break;
            case 'work-end':
              displayText = 'Työ lopetettu';
              break;
            case 'remove-marker':
              displayText = "Merkki poistettu";
              break;
            case 'added-calendarmark':
              displayText = "Lisätty kalenteri merkki";
              break;
            case 'updated-calendarmark':
              displayText = "Muokattu kalenteri merkki";
              break;
            case 'deleted-calendarmark':
              displayText = "Poistettu kalenteri merkki"
              break;
            default:
              displayText = item.type;
            }

            return (

            <View style={styles.eventContainer}>

              <View>
                <View style={styles.type}>
                  {item.markerNumber ?
                    <Text style={styles.text}>{displayText} ({item.markerNumber})</Text>
                    : <Text style={styles.text}>{displayText}</Text>
                  }
                  
                  <Text style={styles.text}>{timeStampChanger(item.timestamp)}</Text>
                </View>

                <Text style={styles.text}>Työmaalle: {item.worksite.address}</Text>
                {item.calendarDate && 
                  <Text style={styles.text}>Kalenteri pvm: {item.calendarDate}</Text>
                }
                <Text style={styles.text}>Käyttäjä: {item.user?.email}</Text>
              </View>

          </View>
          )
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>ei dataa</Text>
          </View>
        )}
        />

    </View>
    )

}

const styles = StyleSheet.create({
    mainContainer: {
      marginBottom: 70,
    },
    text: {
      color: "black",
      fontSize: 16,
    },
    eventContainer: {
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
  
      width: '100%'
    }
  });



export default Events