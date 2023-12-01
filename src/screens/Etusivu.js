import { Text, View, StyleSheet, FlatList } from "react-native";
import {useContext, useEffect, useState} from 'react';
import { Context as Autcontext} from '../context/AuthContext'
import {Context as EventContext} from '../context/EventsContext'
import {Button} from 'react-native-elements'
import { useTranslation } from "react-i18next";
import DownloadScreen from "../components/DownloadScreen";
import { timeStampChanger } from "../utils/timestampChanger";

const Etusivu = ({navigation}) => {
  const { t } = useTranslation();
  const { state, fetchUser } = useContext(Autcontext);
  const {state: eventState,fetchEvents } = useContext(EventContext)
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  
  // Haetaan AuthCOntect.js avulla tiedot käyttäjästä.
  // useEffect(() => {

    
  //   fetchUser();
  //   fetchEvents();
    
    
    
    
  // },[])

  useEffect(() => {
    const fetchAndSetData = async () => {
      setIsLoading(true);
      await fetchUser();
      await fetchEvents();
      setIsLoading(false)
    }
    const unsubscribe = navigation.addListener('focus', fetchAndSetData)
    
    
    return unsubscribe;
  })


  useEffect(() => {
    if (eventState.events) {
      setEvents(eventState.events);
    }
  }, [eventState.events])

  if (isLoading) {
    return <DownloadScreen message="ladataan" />
  }
  
  return (
    <View>
      <FlatList 
        data={events}
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
                <Text style={styles.text}>Käyttäjä: {item.user.email}</Text>
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

};

const styles = StyleSheet.create({
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
});

export default Etusivu;
