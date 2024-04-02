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
import { getCurrentDate } from "../utils/currentDate";

import {futureStartTime} from '../utils/calcFutureWorksite'


const Etusivu = ({navigation}) => {
  const { t } = useTranslation(); //Säilytä 
  const { state, fetchUser } = useContext(Autcontext); 
  const {state: eventState,fetchEvents } = useContext(EventContext) 
  const {state: worksiteState,fetchWorksites} = useContext(WorksiteContext)
  const [events, setEvents] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);

  const role = state?.user?.role;
  const userId = state?.user?._id;
  
  

  
  const [selectedTitle, setSelectedTitle] = useState(null); // Käytetään tätä kun valitaan mitä halutaan näkyväksi
  
  const handlePress = (title) => {
    setSelectedTitle(title);
  }



  // Haetaan AuthCOntect.js avulla tiedot käyttäjästä.
 

  useEffect(() => {
    const fetchAndSetData = async () => {
      setIsLoading(true);
      await fetchUser();
      await fetchWorksites();
      await fetchEvents();
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


  let worksitesToShow = worksiteState.worksites;
  
  if (role === "user") {
    worksitesToShow = worksiteState.worksites.filter(worksite => 
      worksite.workers.includes(userId)
      )
  }
  let futureStart = []; // luodaan muuttuja johon laitetaan tulevaisuudessa alkavat työmaat
  let notReadyWorksites = []; // luodaan muuttuja johon laitetaan työmaat jotka on aloitettu mutta ei ole valmiina
  
  worksitesToShow.forEach(worksite => {
    if (!worksite.workDays || worksite.workDays.length === 0) {
      // Jos workDays on tyhjä, tarkista onko työmaan aloitusaika tulevaisuudessa
      if (futureStartTime(worksite.startTime)) {
        futureStart.push(worksite);
      }
    } else if (!worksite.isReady) {
      // Jos workDays ei ole tyhjä, mutta työmaa ei ole valmis, lisää notReadyWorksites-listaan
      notReadyWorksites.push(worksite);
    }
  });
  const readyWorksites = worksitesToShow.filter(worksite => worksite.isReady === true);
  


  const accordionData = [
    { title: t('etusivuEventsButton'), content: <Events events={events} /> },
    { title: t('etusivuReadyButton'), content: <WorksiteReady worksites={readyWorksites} title="valmiit" /> },
    { title: t('etusivuUnfinishedButton'), content: <WorksiteReady worksites={notReadyWorksites} title="Keskeneräiset" /> },
    { title: t('etusivuStartingdButton'), content: <WorksiteReady worksites={futureStart} title="Alkamassa" /> },
    // Lisää muita otsikoita ja sisältöjä tarpeen mukaan
  ];




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
  
});

export default Etusivu;
