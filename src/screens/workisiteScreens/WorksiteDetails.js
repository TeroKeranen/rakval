
import {View, Text, StyleSheet, ActivityIndicator, Alert, Button, Image, TouchableOpacity, ImageBackground} from 'react-native'
import {Context as WorksiteContext} from '../../context/WorksiteContext'
import {Context as AuthContext} from '../../context/AuthContext'
import { useContext, useEffect, useState } from 'react';
import DownloadScreen from '../../components/DownloadScreen';
import { useTranslation } from "react-i18next";
import {FLOORPLAN_PHOTO_URL} from '@env'


const WorksiteDetails = ({route, navigation}) => {

  return (
    <View>
      <Text>Moi</Text>
    </View>
  )
  // const { t } = useTranslation();
  // const [isLoading, setIsLoading] = useState(false);
  // const { worksiteId } = route.params;
  // const { state, fetchWorksiteDetails, fetchWorksites, resetCurrentWorksite, deleteWorksite, startWorkDay, endWorkDay,worksiteReady } = useContext(WorksiteContext);
  // const { state: authState } = useContext(AuthContext); // Etsitään käyttäjän tiedot
  // const isAdmin = authState.user && authState.user.role === "admin"; // jos on käyttäjä ja rooli on admin === true
  // const worksiteIsReady = state.currentWorksite?.isReady; // katsotaan onko työmaa valmis vai ei
  
  // const [dayIsOn, setDayIsOn] = useState(false);

  // useEffect(() => {
    
  //   async function loadDetails() {
  //     try {
  //       setIsLoading(true);
  //       await fetchWorksiteDetails(worksiteId);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       // console.log("current",state.currentWorksite.workDays.workDays)
  //       setIsLoading(false);
  //     }
  //   }

  //   loadDetails();
  // }, [worksiteId]);

  // useEffect(() => {
    
  //   const checkOngoingWorkDay = () => {
  //     // Varmista, että workDays on olemassa ja se on taulukko
      
  //     if (state.currentWorksite && Array.isArray(state.currentWorksite.workDays)) {
  //       // Tee pyyntö backendiin tarkistaaksesi, onko käyttäjällä käynnissä olevaa työpäivää
  //       const userId = authState.user._id;
  //       const ongoingWorkDay = state.currentWorksite.workDays.find((workDay) => workDay?.workerId === userId && workDay?.running === true);
        
        
  //       setDayIsOn(!!ongoingWorkDay);
        
  //     }
  //   };
  //   checkOngoingWorkDay();
    
  // }, [state.currentWorksite, authState.user._id]); // Riippuvuudet päivitetty


  
  // const confirmDelete = (worksiteId) => {
  //   Alert.alert(t("worksitedetail-deleteBtn"), t("worksitedetail-confirmdelete"), [
  //     { text: t("worksitedetail-confirmDelete-cancelButton"), style: "cancel" },
  //     {
  //       text: t("worksitedetail-confirmDelete-deleteButton"),
  //       onPress: () =>
  //         deleteWorksite(worksiteId, (success) => {
  //           if (success) {
  //             Alert.alert(t('worksiteDeleteSuccess'))
  //             navigation.goBack();
  //           } else {
  //             Alert.alert(t('worksiteDeleteError'))
  //           }
  //         }),
  //     },
  //   ]);
  // };
  
  // const handleStartDay = async () => {
    
  //   // Haetaan käyttäjän id
  //   const userId = authState.user._id;
    
    
    
  //   // Etsitään onko käyttäjällä missään työmaalla työpäivä käynnissä
  //   const ongoingWorkDayAnyWorksite = state.worksites.some(worksite => 
        
  //       worksite.workDays.find(workDay => workDay.workerId === userId && workDay.running === true)
  //     )
      
  //   if (ongoingWorkDayAnyWorksite) {
      
  //     Alert.alert(
  //       "työpäivä jo käynnissä",
  //       "Sinulla on jo käynnissä oleva työpäivä toisella työmaalla. Lopeta se ensin, ennen kuin aloitat uuden",
  //       [{text: "OK"}]
  //     )
  //     return;
  //   }
  //   // Etsi onko käyttäjällä jo käynnissä oleva työpäivä kyseisellä työmaalla
  //   const ongoingWorkDay = state.currentWorksite.workDays.find((workDay) => workDay.workerId === userId && workDay.running === true);

  //   if (ongoingWorkDay) {
      
  //     return;
  //   }

  //   await startWorkDay(state.currentWorksite._id, authState.user._id);
  //   await fetchWorksiteDetails(state.currentWorksite._id);
  //   setDayIsOn(true);
  // };

  // const handleEndDay = async () => {
    
  //   // Hae käyttäjän id
  //   const userId = authState.user._id;

  //   // console.log("workdays", state.currentWorksite.workDays)
  //   const ongoingWorkDay = state.currentWorksite.workDays.find((workDay) => workDay.workerId === userId && workDay.running === true);
    
    
  //   if (ongoingWorkDay) {
  //     await endWorkDay(state.currentWorksite._id, ongoingWorkDay._id);
  //     await fetchWorksiteDetails(state.currentWorksite._id);
  //     setDayIsOn(false);
  //   } else {
  //     console.log("Ei käynnissä olevaa työpäivää löydetty");
  //   }
  // };

  // // käytetään tätä kun halutaan merkitä työmaa valmiiksi
  // const handleWorksiteReady = async () => {
  //   Alert.alert(
  //     t('confirmTitle'),
  //     t('confirmText'),
  //     [
  //       {
  //         text:t('cancel'),
  //         onPress: () => console.log("peruutettu"),
  //         style:"cancel"
  //       },
  //       {text: "OK", onPress: async () => {
  //         try {
  //           const response = await worksiteReady(worksiteId)
  //           if (response.success) {
  //             Alert.alert(t('complete-success'))
  //           } else {
  //             Alert.alert(t('goeswrong'))
  //           }
            
  //         } catch (err) {
  //           console.log(err);
  //         }
  //       }}
  //     ],
  //     { cancelable: false }
  //   )
  // }

  // if (isLoading) {
  //   return <DownloadScreen message={t("worksitedetail-downloadscreen-msg")} />;
  // }

  // const floorplanKey = state.currentWorksite.floorplanKey;
  // return (
  //   <View style={styles.container}>
  //     <ImageBackground
  //         source={require('../../../assets/map.jpg')}
          
  //         style={styles.background}
  //       >
  //     <View style={styles.textContainer}>
  //       <View style={styles.test}>

  //         <Text style={styles.text}>
  //           {t("workistedetail-address")}:{state.currentWorksite.address}
  //         </Text>

  //         <Text style={styles.text}>
  //           {t("worksitedetail-city")}: {state.currentWorksite.city}
  //         </Text>
  //         <Text style={styles.text}>
  //           {t('plannedStartingDate')}: {state.currentWorksite.startTime ? state.currentWorksite.startTime : "Ei valittua päivämäärää"}
  //         </Text>
  //       </View>
  //       {/* <View style={styles.imageContainer}>
  //         <Image source={{ uri: `${FLOORPLAN_PHOTO_URL}${floorplanKey}` }} style={styles.image} />
  //       </View> */}

  //       <View style={styles.buttonContainer}>
          
  //         {!worksiteIsReady && (dayIsOn ? 
  //           <TouchableOpacity style={styles.workDaybutton} onPress={handleEndDay}>
  //             <Text style={{color: 'white'}}>{t('worksitedetail-endWorkDay')}</Text>
  //           </TouchableOpacity> : 
  //           <TouchableOpacity style={styles.workDaybutton} onPress={handleStartDay}>
  //             <Text style={{color: 'white'}}>{t('worksitedetail-startWorkDay')}</Text>
  //           </TouchableOpacity>
  //           )} 
  //           {!worksiteIsReady ? 
            
  //           <TouchableOpacity style={styles.workDaybutton} onPress={handleWorksiteReady}>
  //             <Text style={{color: 'white'}}>{t('complete')}</Text>
  //           </TouchableOpacity>
  //           : null
  //         } 
  //       </View>
  //     </View>
  //       </ImageBackground>

     
      
  //     <View style={styles.buttonContainer}>
  //       {isAdmin && 
  //         <TouchableOpacity onPress={() => confirmDelete(worksiteId)} style={styles.button}>
  //           <Text style={{color: 'white'}}>{t("worksitedetail-deleteBtn")}</Text>
  //         </TouchableOpacity>
  //       }
  //     </View>
  //     {/* <View style={styles.buttonContainer}>
  //       {dayIsOn ? <Button title="lopeta työpäivän" onPress={handleEndDay} /> : <Button title={t("worksiteDetail-startDay")} onPress={handleStartDay} />}
        
  //     </View> */}
  //   </View>
  // );
}


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     marginVertical: 20,
//     padding: 20,
    
//   },
//   background: {
//     flex: 1,
//     resizeMode: 'contain',
//     width: '100%',
//     borderRadius: 10,
//     padding: 0,
    
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.15,
//     shadowRadius: 3.84,
//     elevation: 5,
    
//   },
//   textContainer: {
//     flex: 1,
//     // backgroundColor: "#e8e8f0",
    
//     width:'100%',
//     padding: 10,

    
//     // borderRadius: 10,
//     // shadowColor: "#000",
//     // shadowOffset: {
//     //   width: 0,
//     //   height: 2,
//     // },
//     // shadowOpacity: 0.15,
//     // shadowRadius: 3.84,
//     // elevation: 5,
//   },
//   test: {
//     flex:1,
    
//     padding: 0,
//     margin: 0,
    
//   },
//   text: {
//     fontSize: 20,
//     fontWeight:'bold',
//     alignSelf: 'center',
    
//     width: '100%',
//     color: 'white'
    

//   },
//   imageContainer: {
//     flex: 1,
//     marginTop: 30,
//     justifyContent:'center',
//     alignItems: 'center'
//   },
//   buttonContainer: {
//     width: '100%',
//     marginTop: 60,
    
//   },
//   image: {
    
//     width: 200,
//     height: 200,
//     // Muut kuvan tyylit
//   },
//   button: {
//     backgroundColor: "#b85050",
//         padding: 10,
//         borderRadius: 5,
//         marginVertical: 10,
//         // width: "50%",
//         alignItems: "center",
//         alignSelf:'center',
//         shadowColor: "#000",
//         shadowOffset: {
//           width: 0,
//           height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//   },
//   workDaybutton: {
//     backgroundColor: "#507ab8",
//         padding: 10,
//         borderRadius: 5,
//         marginVertical: 10,
//         // width: "50%",
//         alignItems: "center",
//         alignSelf:'center',
//         shadowColor: "#000",
//         shadowOffset: {
//           width: 0,
//           height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//   }
// });

export default WorksiteDetails;