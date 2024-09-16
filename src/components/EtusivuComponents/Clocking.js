import { StyleSheet, Text, View, Animated, Easing } from "react-native";
import { useContext, useEffect, useRef, useState } from "react";

import {Context as AuthContext} from '../../context/AuthContext'
import { Context as WorksiteContext } from "../../context/WorksiteContext";
import { useTranslation } from "react-i18next";


const Clocking = ({worksites, userRole="admin", userId}) => {

    

    const [activeTime, setActiveTime] = useState("N/A"); // Kellotusajan tila
    const [activeWorksite, setActiveWorksite] = useState(null); // Aktiivinen työmaa

    const {t} = useTranslation();

    const pulseAnim = useRef(new Animated.Value(1)).current; // Animaation arvo

    const startPulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1, // Suurentaa ympyrää 1.2-kertaiseksi
            duration: 700, // Animaation kesto
            useNativeDriver: true, // Käytä native-renderöintiä
            easing: Easing.linear,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1, // Palauttaa ympyrän alkuperäiseen kokoon
            duration: 500,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ]),
      ).start();
    };
  


      // Funktio kellotusajan laskemiseen
  const calculateActiveTime = (workDays) => {
    
    // const runningDay = workDays.find(day => day.running === true);
    const runningDay = workDays.find(day => day.running === true && day.workerId === userId);
    
    if (runningDay) {
        // Muodosta päivämäärä oikeaan muotoon
        const startDate = runningDay.startDate.split('.').reverse().join('-'); // Muutetaan muotoon "YYYY-MM-DD"
        const startTime = new Date(`${startDate}T${runningDay.startTime}`);
    
        
    
        if (isNaN(startTime.getTime())) {
          console.error("Invalid date or time format for startTime:", startTime);
          return "Invalid time";
        }
    
        const currentTime = new Date(); // Nykyinen aika
    
        
    
        // Lasketaan erotus millisekunneissa
        const timeDifference = currentTime - startTime;
        
    
        // Muunnetaan erotus tunteina ja minuutteina
        const hours = Math.floor(timeDifference / (1000 * 60 * 60)); // Muunnetaan millisekunnit tunneiksi
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); // Jäännöksen minuutit
    
        
    
        // Jos tunteja ei ole, näytetään vain minuutit
        if (hours === 0 && minutes > 0) {
          return `${minutes}m`; // Palauta vain minuutit, jos tunteja ei ole
        }
        
        // Näytetään sekä tunnit että minuutit
        return `${hours}h ${minutes}m`;
      }
    
    return "N/A"; // Jos ei aktiivista kellotusta
  };
  
  // Päivitetään kellotusaika reaaliajassa ja työmaan tunnistus
  useEffect(() => {
    const findRunningWorksite = () => {
      const runningWorksites = worksites.reduce((acc, worksite) => {
        const activeWorkDays = worksite.workDays
          ? worksite.workDays.filter((day) => day.running)
          : [];

        if (activeWorkDays.length > 0) {
          const activeWorkerIds = activeWorkDays.map((day) => day.workerId);
          if (activeWorkerIds.includes(userId)) {
            const activeTimeString = calculateActiveTime(worksite.workDays);
            setActiveTime(activeTimeString); // Päivitetään tila kellotusajalla
            acc.push(worksite);
          }
        }
        return acc;
      }, []);

      if (runningWorksites.length > 0) {
        setActiveWorksite(runningWorksites[0]); // Päivitetään aktiivinen työmaa
      } else {
        setActiveWorksite(null); // Ei aktiivista työmaata
        setActiveTime("N/A"); // Nollataan kellotusaika
      }
    };

    findRunningWorksite(); // Päivitetään aktiivinen työmaa ja kellotusaika aina kun `worksites` muuttuu

    const interval = setInterval(findRunningWorksite, 60000); // Päivitä kerran minuutissa

    return () => clearInterval(interval); // Puhdista intervalli komponentin poistuessa
  }, [worksites, userId]); // Tämä efekti päivittyy vain, kun `worksites` tai `userId` muuttuu

  useEffect(() => {
    if (activeWorksite) {
      startPulse(); // Käynnistä sykintä, kun on aktiivinen työmaa
    }
  }, [activeWorksite]);
      
    

    if (!activeWorksite) {
        return (
          <View style={styles.container}>
            <Text style={styles.text}>{t('etusivu-noActivework')}</Text>
          </View>
        );
      }

    return (
    <View style={styles.container}>
      <View style={styles.ballContainer}>
        <Animated.View
          style={[styles.circle, { transform: [{ scale: pulseAnim }] }]}
        >
          {/* Näytä laskettu kellotusaika */}
          <Text style={styles.text}>{activeTime}</Text>
        </Animated.View>
      </View>

        <View style={styles.textContainer}>
          <View style={styles.textBox}>
            
            <Text style={styles.text}>
              {activeWorksite.address}, {activeWorksite.city}
            </Text>
          </View>
        </View>
    </View>
    )

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems:'center',
        height: 100,
        width: '90%',
        padding:4,
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

    },
    ballContainer: {
        justifyContent: 'center',
        marginLeft: 5,
    },

    textContainer: {
        flex: 1,
    
        justifyContent: 'center',
        alignItems: 'center',
        // borderColor: 'white',
        flexDirection: 'row',

    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 100, // 50% of width/height to make a perfect circle
        borderWidth: 5,
        borderColor: '#d9dfe1',
        backgroundColor: '#3f643f', // Aseta vihreäksi kun työ on aktiivinen
        justifyContent: 'center',
        alignItems: 'center',
      },
    text: {
        color: 'white'
    }
})

export default Clocking;