import { Text, View, StyleSheet, FlatList, TextInput, SafeAreaView } from "react-native";
import {useContext, useEffect, useState} from 'react';
import { Context as Autcontext} from '../context/AuthContext'
import {Context as EventContext} from '../context/EventsContext'
import {Context as WorksiteContext} from '../context/WorksiteContext'

import { useTranslation } from "react-i18next";
import DownloadScreen from "../components/DownloadScreen";
import { timeStampChanger } from "../utils/timestampChanger";
import { Ionicons } from "@expo/vector-icons";
import Events from "../components/EtusivuComponents/Events";
import Accordion from "../components/EtusivuComponents/Accordion";
import { TouchableOpacity } from "react-native-gesture-handler";
import WorksiteReady from "../components/EtusivuComponents/WorksiteReady";


const Etusivu = ({navigation}) => {
  const { t } = useTranslation(); //Säilytä 
  const { state, fetchUser } = useContext(Autcontext); // SÄILYTÄ
  const {state: eventState,fetchEvents } = useContext(EventContext) // SÄILYTÄ
  const {state: worksiteState} = useContext(WorksiteContext)
  const [events, setEvents] = useState([]); // SÄILYTÄ JA VÄLITÄ EVENTS COMPONENTILLE
  const [isLoading, setIsLoading] = useState(false);// SÄILYTÄ 
  // const [searchTerm, setSearchTerm] = useState(''); //MUUTOS

  const [selectedTitle, setSelectedTitle] = useState(null); // Käytetään tätä kun valitaan mitä halutaan näkyväksi

  const handlePress = (title) => {
    setSelectedTitle(title);
  }



  // Haetaan AuthCOntect.js avulla tiedot käyttäjästä.
 

  useEffect(() => {
    const fetchAndSetData = async () => {
      setIsLoading(true);
      fetchUser();
      fetchEvents();
      setIsLoading(false)
      
    }
    const unsubscribe = navigation.addListener('focus', fetchAndSetData)


    return unsubscribe;
  })


  useEffect(() => {
    if (eventState.events) {
      // Käännetään lista siten että ekana näkyy uusimmat
      const reservedEvents = [...eventState.events].reverse();
      setEvents(reservedEvents);
    }
  }, [eventState.events])
  const readyWorksites = worksiteState.worksites.filter(worksite => worksite.isReady === true);
    const notReadyWorksites = worksiteState.worksites.filter(worksite => !worksite.isReady);

  const accordionData = [
    { title: 'Events', content: <Events events={events} /> },
    { title: 'Valmiit', content: <WorksiteReady worksites={readyWorksites} title="valmiit" /> },
    { title: 'Kesken', content: <WorksiteReady worksites={notReadyWorksites} title="Kesken" /> },
    // Lisää muita otsikoita ja sisältöjä tarpeen mukaan
  ];


  // // Käytetään tätä etusivun haku toiminnossa apuna
  // const translateEventType = (type) => {
  //   switch (type) {
  //     case 'work-start':
  //       return 'työ aloitettu';
  //     case 'work-end':
  //       return 'työ lopetettu';
  //     case 'added-marker':
  //       return 'lisätty merkki';
  //     case 'added-calendarmark':
  //       return 'Lisätty kalenteri merkki';
  //     case 'deleted-calendarmark':
  //       return 'Poistettu kalenteri merkki'
  //     // Lisää muita tapauksia tarvittaessa
  //     default:
  //       return type;
  //   }
  // };

  // const displayEvents = searchTerm.length === 0
  //   ? events
  //   : events.filter(event => {
  //     const translatedType = translateEventType(event.type).toLowerCase();
  //     return (
  //       event.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       event.worksite.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       translatedType.includes(searchTerm.toLocaleLowerCase()) ||
  //       timeStampChanger(event.timestamp).includes(searchTerm)

  //       // Lisää muita suodatusehtoja tarpeen mukaan
  //     );
  //   })

  if (isLoading) {
    return <DownloadScreen message={t('loading')} />
  }

  return (
        
        <View>
          
          <View style={styles.accContainer}>

          {accordionData.map((item, index) => (
                    <Accordion 
                        key={index} 
                        title={item.title} 
                        handlePress={() => handlePress(item.title)}
                    />
                ))}
          </View>

          {accordionData.map((item, index) => (
                selectedTitle === item.title && <View key={index}>{item.content}</View>
            ))}
          

        </View>
      
    
  )

};


const styles = StyleSheet.create({
  accContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // Lisää tähän tarvittavat tyylit
  },
  
  // mainContainer: {
  //   marginBottom: 70,
  // },
  // text: {
  //   color: "black",
  //   fontSize: 16,
  // },
  // eventContainer: {
  //   alignSelf: 'center',
  //   backgroundColor: '#ddd4d4',
  //   width: '90%',
  //   marginVertical: 6,
  //   padding: 10,
  //   borderRadius: 10,
  //   elevation: 3,
  //   shadowColor: "black",
  //   shadowRadius: 4,
  //   shadowOffset: { width: 1, height: 1 },
  //   shadowOpacity: 0.4,

  // },
  // type: {
  //   flexDirection: 'row',
  //   justifyContent:'space-between',
  //   marginBottom: 10,

  // },
  // emptyListContainer: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   padding: 20,
  // },
  // emptyListText: {
  //   fontSize: 16,
  //   color: 'grey',
  // },
  // textinputContainer: {
  //   marginVertical: 10,
  //   padding: 5,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   borderWidth: 1,
  //   borderColor: 'grey',
  //   borderRadius: 5,
  //   width: '90%',
  //   alignSelf: 'center'
  // },
  // textinput: {
  //   padding: 3,

  //   width: '100%'
  // }
});

export default Etusivu;
