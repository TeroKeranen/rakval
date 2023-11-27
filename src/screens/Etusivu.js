import { Text, View, StyleSheet } from "react-native";
import {useContext, useEffect, useState} from 'react';
import { Context as Autcontext} from '../context/AuthContext'
import {Context as EventContext} from '../context/EventsContext'
import {Button} from 'react-native-elements'
import { useTranslation } from "react-i18next";

const Etusivu = () => {
  const { t } = useTranslation();
  const { state, fetchUser } = useContext(Autcontext);
  const {state: eventState,fetchEvents } = useContext(EventContext)
  const [events, setEvents] = useState([]);


  // Haetaan AuthCOntect.js avulla tiedot käyttäjästä.
  useEffect(() => {
    fetchUser();
    fetchEvents();
    
    // console.log("etusivu state", state)
    
    
  },[])

  useEffect(() => {
    if (eventState.events) {
      setEvents(eventState.events);
    }
  }, [eventState.events])
  
  return (
    <View>
      <Text style={styles.text}>{t('front-page')}</Text>
      {events.map((event,index) => (
        <View key={index}>
          <Text>Tapahtuma: {event.type} --- {event.user.email} --- {event.worksite.address}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
});

export default Etusivu;
