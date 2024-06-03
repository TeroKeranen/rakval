// import { FlatList, StyleSheet, Text, View } from "react-native";
// import { Context as AuthContext } from "../../context/AuthContext";
// import { Context as WorksiteContext } from "../../context/WorksiteContext";
// import { useContext, useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// const WorkOn = ({worksites, userRole="admin", userId="12344"}) => {

//     const {state: authState, fetchUserWithId } = useContext(AuthContext)
//     const {state: worksiteState,fetchWorksites} = useContext(WorksiteContext)
//     const [userDetails, setUserDetails] = useState({});
//     const [isRefreshing, setIsRefreshing] = useState(false);
//     const {t} = useTranslation();
    
//     const runningWorkSites = worksites.reduce((acc, worksite) => {
        
//         // Vain ne työmaat, joilla on aktiivisia työpäiviä
//         const activeWorkDays = worksite.workDays ? worksite.workDays.filter(day => day.running) : [];
        
//         if (activeWorkDays.length > 0) {
//             // Luo uusi objekti jokaiselle työmaalle, joka sisältää työmaan tiedot ja aktiiviset workerId:t
//             acc.push({
//                 worksiteInfo: worksite,
//                 activeWorkerIds: activeWorkDays.map(day => day.workerId)
//             });
//         }
//         return acc;
//     }, []);

    
    
//     const filteredRunningWorksites = runningWorkSites.filter(site => {
//         if (userRole === 'admin') {
//             return true;
//         } else {
//             return site.activeWorkerIds.includes(userId);
//         }
//     })

//     useEffect(() => {
//         const fetchWorkers = async () => {
//             let userMap = {};
//             // Kerää kaikki uniikit userId:t taulukkoon
//             const userIds = new Set(runningWorkSites.flatMap(site => site.activeWorkerIds));
            
//             for (let id of userIds) {
//                 const userData = await fetchUserWithId(id);
//                 if (userData) {
//                     userMap[id] = userData.email; // Oletetaan että käyttäjän nimi on userData.name
//                 }
//             }

//             setUserDetails(userMap);
//         };

//         fetchWorkers();
//     }, [worksites]);

    
//     const onRefresh =  async () => {
//         setIsRefreshing(true); // Aseta päivitystila todeksi
//         await fetchWorksites().then(result => {
//           console.log(result); // Logiikka tulosten käsittelyyn
//           setIsRefreshing(false); // Aseta päivitystila epätodeksi, kun olet valmis
//         })
//         .catch(error => {
//           console.error('Failed to refresh events:', error);
//           setIsRefreshing(false); // Aseta päivitystila epätodeksi, jos tulee virhe
//         });
//       }
 
//     const renderRunningWorksites = ({item}) => {
//         return (
//             <View style={styles.worksiteItem}>
//                 <Text>Osoite: {item.worksiteInfo.address}</Text>
//                 {item.activeWorkerIds.map(id => (
//                     <Text key={id}>{userDetails[id]}</Text>
//                 ))}
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>{t('workOn')}</Text>
//             <FlatList 
//                 data={filteredRunningWorksites}
//                 contentContainerStyle={{paddingBottom: 150}}
//                 refreshing={isRefreshing}  // Päivitysindikaattorin tila
//                 onRefresh={onRefresh}      // Päivitysmetodi
//                 renderItem={renderRunningWorksites}
//                 keyExtractor={(worksite) => `tyomaa-${worksite.worksiteInfo._id}`}
                
//                 />
//         </View>
        
//     )

// }

// const styles = StyleSheet.create({
//     container: {
        
//         width: '90%'
//     },
//     title: {
//         color: 'white',
//         alignSelf: 'center',
//         fontSize: 20,
//         fontWeight: '600'
//       },
//     worksiteItem: {
//         alignSelf: 'center',
//       backgroundColor: '#ddd4d4',
//       width: '90%',
//       marginVertical: 6,
//       padding: 10,
//       borderRadius: 10,
//       elevation: 3,
//       shadowColor: "black",
//       shadowRadius: 4,
//       shadowOffset: { width: 1, height: 1 },
//       shadowOpacity: 0.4,
//     }
// })

// export default WorkOn;