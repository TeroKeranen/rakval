import { Text, View, StyleSheet, FlatList, TextInput, SafeAreaView, ImageBackground, TouchableOpacity, Modal  } from "react-native";
import {useContext, useEffect, useState} from 'react';
import { Context as Autcontext} from '../context/AuthContext'
import {Context as EventContext} from '../context/EventsContext'
import {Context as WorksiteContext} from '../context/WorksiteContext'
import {Context as CompanyContext} from '../context/CompanyContext'

import { useTranslation } from "react-i18next";
import DownloadScreen from "../components/DownloadScreen";

import Events from "../components/EtusivuComponents/Events";
import Accordion from "../components/EtusivuComponents/Accordion";
import WorksiteReady from "../components/EtusivuComponents/WorksiteReady";

import LogoImage from '../../assets/logo-color.png'
import {futureStartTime} from '../utils/calcFutureWorksite'
import WorkOn from "../components/EtusivuComponents/WorkOn";
import Clocking from "../components/EtusivuComponents/Clocking";
import StartingWork from "../components/EtusivuComponents/StartingWork";


const Etusivu = ({navigation}) => {


  const { t } = useTranslation(); //Säilytä 
  const { state, fetchUser } = useContext(Autcontext); 
  const {state: eventState,fetchEvents } = useContext(EventContext) 
  const {state: worksiteState,fetchWorksites} = useContext(WorksiteContext)
  const {state: companyState,fetchCompany} = useContext(CompanyContext);
  const [events, setEvents] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // avataan events modal
  const [selectedContent, setSelectedContent] = useState(null); // Tila modalin sisällölle
  
  const role = state?.user?.role;
  const userId = state?.user?._id;
  const worksites = worksiteState.worksites;
  const company = state.user?.company;
  const eventsState = eventState;

  useEffect(() => {
    
    const loadCompany = async () => {
      setIsLoading(true);
      // await fetchCompany();
      fetchCompany();
      
      setIsLoading(false);
    };
    loadCompany();
    
  }, []);

  
  
  
  
  
  
  

  const handleOpenModal = (contentType) => {
    setSelectedContent(contentType);
    setModalVisible(true); // Avaa modal
  };
  
  
  // Haetaan AuthCOntect.js avulla tiedot käyttäjästä.
  
  
  useEffect(() => {
    const fetchAndSetData = async () => {
      if (!worksiteState.worksites.length || !eventState.events.length) {
        // setIsLoading(true);
        await fetchUser();
        if (company) {
          await Promise.all([fetchWorksites(), fetchEvents()])
          // await fetchWorksites();
        } else {
          await fetchEvents();
        }
        // await fetchEvents();
        // setIsLoading(false);
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
  









  if (isLoading) {
    return <DownloadScreen message={t('loading')} />
  }

  return (
      
        <ImageBackground
          source={LogoImage}
          
          style={styles.background}
        >
        <View style={styles.overlay}>

        {/* tämä on uusi*/}

        <View style={styles.container}>

          <View style={styles.activeWork}>
            <Text style={{color: 'white', fontSize: 20, marginTop: 10}}>{t('etusivu-activeTitle')}</Text>
            <Clocking worksites={worksites} userRole={role} userId={userId}/>
          </View>

          <View style={styles.activeWork}>
            <Text style={{color: 'white', fontSize: 20, marginTop: 10}}>{t('etusivu-futureworkTitle')}</Text>
            <StartingWork futureStart={futureStart}/>
          </View>

          {/* Lisää tähän nappi, joka avaa modaalin */}
          <View style={styles.littleButtons}>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleOpenModal('events')}
              >
              <Text style={styles.buttonText}>{t('etusivuEventsButton')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleOpenModal('ready')}
              >
              <Text style={styles.buttonText}>{t('etusivuReadyButton')}</Text>
            </TouchableOpacity>
            
            {role === "admin" || role === "superAdmin" && 
              <TouchableOpacity style={styles.button} onPress={() => handleOpenModal('workOn')}>
                <Text style={styles.buttonText}>{t('etusivuActive')}</Text>
              </TouchableOpacity>}

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleOpenModal('unfinished')}
              >
              <Text style={styles.buttonText}>{t('etusivuUnfinishedButton')}</Text>
            </TouchableOpacity>
          </View>
          
          {selectedContent === 'events' && (
              <Events events={events} modalVisible={modalVisible} onClose={() => setModalVisible(false)} />
            )}
          {selectedContent === 'ready' && (
              <WorksiteReady worksites={readyWorksites} modalVisible={modalVisible} title={t('ready')} onClose={() => setModalVisible(false)}/>
            )}
          {selectedContent === 'unfinished' && (
              <WorksiteReady worksites={notReadyWorksites} modalVisible={modalVisible} title={t('unfinished')} onClose={() => setModalVisible(false)}/>
            )}
          {selectedContent === 'workOn' && (
              <WorkOn worksites={worksites} userRole={role} modalVisible={modalVisible} userId={userId} onClose={() => setModalVisible(false)}/>
            )}
         

        </View>
      
          </View>
          </ImageBackground>
    
  )

};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    height: '100%',
  },
  test: {
    alignItems: 'center'
  },
  activeWork: {
    
    justifyContent: 'center',
    alignItems: 'center'
  },
  littleButtons: {

    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  buttonText: {
    color: 'white',
    fontWeight: '700'
  },
  button: {
            
    padding:20,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: 15,
    marginHorizontal: 10,
    shadowColor: '#000000', // Varjon väri
    shadowOffset: { width: 0, height: 4 }, // Varjon offset (suunta)
    shadowOpacity: 1, // Varjon peittävyys
    shadowRadius: 4, // Varjon sumeus
    elevation: 5, // Android-varjo
    backgroundColor: '#333644', // Tausta lisättävä, jotta varjo näkyy kunnollas Androidilla)
    elevation: 5, // Vain Androidille
  }
  
});

export default Etusivu;
