import { Text, View, StyleSheet, FlatList, TextInput, SafeAreaView, ImageBackground, TouchableOpacity  } from "react-native";
import {useContext, useEffect, useState} from 'react';
import { Context as Autcontext} from '../context/AuthContext'
import {Context as EventContext} from '../context/EventsContext'
import {Context as WorksiteContext} from '../context/WorksiteContext'

import { useTranslation } from "react-i18next";
import DownloadScreen from "../components/DownloadScreen";

import Events from "../components/EtusivuComponents/Events";
import Accordion from "../components/EtusivuComponents/Accordion";
import WorksiteReady from "../components/EtusivuComponents/WorksiteReady";


import {futureStartTime} from '../utils/calcFutureWorksite'
import WorkOn from "../components/EtusivuComponents/WorkOn";


const Etusivu = ({navigation}) => {


  const { t } = useTranslation(); //Säilytä 
  const { state, fetchUser } = useContext(Autcontext); 
  const {state: eventState,fetchEvents } = useContext(EventContext) 
  const {state: worksiteState,fetchWorksites} = useContext(WorksiteContext)
  const [events, setEvents] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null); // Käytetään tätä kun valitaan mitä halutaan näkyväksi
  
  const role = state?.user?.role;
  const userId = state?.user?._id;
  const worksites = worksiteState.worksites;
  const company = state.user?.company;
  
  
  
  
  
  
  
  
  const handlePress = (title) => {
    if (selectedTitle === title) {
      setSelectedTitle(null);
    } else {
      setSelectedTitle(title);
      
    }
  }
  
  
  
  // Haetaan AuthCOntect.js avulla tiedot käyttäjästä.
  
  
  useEffect(() => {
    const fetchAndSetData = async () => {
      if (!worksiteState.worksites.length || !eventState.events.length) {
        setIsLoading(true);
        await fetchUser();
        if (company) {
          await fetchWorksites();
        }
        await fetchEvents();
        setIsLoading(false);
      }
    };
  
    const unsubscribe = navigation.addListener('focus', fetchAndSetData);
    return unsubscribe;
  }, [worksiteState.worksites, eventState.events]); 

  useEffect(() => {
    
      
        fetchWorksites();
      
    
  }, []);
  

  
  

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
    if (!worksite) {
      
      return;
    }
    
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
    { title: t('etusivuReadyButton'), content: <WorksiteReady worksites={readyWorksites} title={t('ready')} /> },
    { title: t('etusivuUnfinishedButton'), content: <WorksiteReady worksites={notReadyWorksites} title={t('unfinished')} /> },
    { title: t('etusivuStartingdButton'), content: <WorksiteReady worksites={futureStart} title={t('starting')} /> },
    { title: "Ongoing", content: <WorkOn worksites={worksites} userRole={role} userId={userId}/> },
    // Lisää muita otsikoita ja sisältöjä tarpeen mukaan
  ];


  const accordionRows = [];
  for (let i = 0; i < accordionData.length; i += 3) {
    accordionRows.push(accordionData.slice(i, i + 3));
  }




  if (isLoading) {
    return <DownloadScreen message={t('loading')} />
  }

  return (
      
        <ImageBackground
          source={require('../../assets/logo-color.png')}
          
          style={styles.background}
        >
        <View style={styles.overlay}>

        <View style={styles.container}>
          
        {accordionRows.map((row, rowIndex) => (
            <View style={styles.accContainer} key={rowIndex}>
              {row.map((item, index) => (
                <Accordion
                  key={index}
                  title={item.title}
                  handlePress={() => handlePress(item.title)}
                  isSelected={selectedTitle === item.title}
                />
              ))}
            </View>
          ))}
          
          
          {selectedTitle ? (
            accordionData.map((item, index) => (
              selectedTitle === item.title && <View style={styles.test} key={index}>{item.content}</View>
            ))
          ) : (
            null
          )}
          

        </View>
      
          </View>
          </ImageBackground>
    
  )

};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  test: {
    alignItems: 'center'
  },
  accContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // Lisää tähän tarvittavat tyylit
  },
  background: {
    flex: 1, // Varmista, että ImageBackground täyttää koko näytön
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(40, 42, 54, 0.1)',  // Määritä väri ja läpinäkyvyys tarpeen mukaan
  },
  
});

export default Etusivu;
