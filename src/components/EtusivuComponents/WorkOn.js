import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as WorksiteContext } from "../../context/WorksiteContext";
import { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const WorkOn = ({worksites, userRole="admin", userId="12344", modalVisible, onClose}) => {

    const {state: authState, fetchUserWithId } = useContext(AuthContext)
    const {state: worksiteState,fetchWorksites} = useContext(WorksiteContext)
    const [userDetails, setUserDetails] = useState({});
    const [isRefreshing, setIsRefreshing] = useState(false);
    const {t} = useTranslation();
    
    const runningWorkSites = worksites.reduce((acc, worksite) => {
        
        // Vain ne työmaat, joilla on aktiivisia työpäiviä
        const activeWorkDays = worksite.workDays ? worksite.workDays.filter(day => day.running) : [];
        
        if (activeWorkDays.length > 0) {
            // Luo uusi objekti jokaiselle työmaalle, joka sisältää työmaan tiedot ja aktiiviset workerId:t
            acc.push({
                worksiteInfo: worksite,
                activeWorkerIds: activeWorkDays.map(day => day.workerId)
            });
        }
        return acc;
    }, []);

    
    
    const filteredRunningWorksites = runningWorkSites.filter(site => {
        if (userRole === 'admin' || userRole === 'superAdmin') {
            return true;
        } else {
            return site.activeWorkerIds.includes(userId);
        }
    })

    useEffect(() => {
        const fetchWorkers = async () => {
            let userMap = {};
            // Kerää kaikki uniikit userId:t taulukkoon
            const userIds = new Set(runningWorkSites.flatMap(site => site.activeWorkerIds));
            
            for (let id of userIds) {
                const userData = await fetchUserWithId(id);
                if (userData) {
                    userMap[id] = userData.email; // Oletetaan että käyttäjän nimi on userData.name
                }
            }

            setUserDetails(userMap);
        };

        fetchWorkers();
    }, [worksites]);

    
    const onRefresh =  async () => {
        setIsRefreshing(true); // Aseta päivitystila todeksi
        await fetchWorksites().then(result => {
          
          setIsRefreshing(false); // Aseta päivitystila epätodeksi, kun olet valmis
        })
        .catch(error => {
          console.error('Failed to refresh events:', error);
          setIsRefreshing(false); // Aseta päivitystila epätodeksi, jos tulee virhe
        });
      }
 
    const renderRunningWorksites = ({item}) => {
        return (
            <View style={styles.worksiteItem}>
                <Text>Osoite: {item.worksiteInfo.address}</Text>
                {item.activeWorkerIds.map(id => (
                    <Text key={id}>{userDetails[id]}</Text>
                ))}
            </View>
        );
    }

    return (
        <Modal visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}>
        <SafeAreaView style={{flex:1}}>

        <View style={styles.container}>
            <Text style={styles.title}>{t('workOn')}</Text>
            <FlatList 
                data={filteredRunningWorksites}
                contentContainerStyle={{paddingBottom: 150}}
                refreshing={isRefreshing}  // Päivitysindikaattorin tila
                onRefresh={onRefresh}      // Päivitysmetodi
                renderItem={renderRunningWorksites}
                keyExtractor={(worksite) => `tyomaa-${worksite.worksiteInfo._id}`}
                
                />
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#f5f5f5" />
            </TouchableOpacity>
        </View>
        </SafeAreaView>
        </Modal>
        
    )

}

const styles = StyleSheet.create({
    container: {
        
        backgroundColor: "#333644",
        borderTopLeftRadius: 20, // Pyöristetään vain yläkulmat
        borderTopRightRadius: 20,
        paddingVertical: 35,
        // paddingHorizontal: 55,
        width: "100%",
        height: '100%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: '600'
      },
    worksiteItem: {
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
    closeButton: {
        position: "absolute",
        right: 0,
        top: 0,
        padding: 10,
        backgroundColor: "#5656e2",
        borderTopRightRadius: 20,
      },
})

export default WorkOn;