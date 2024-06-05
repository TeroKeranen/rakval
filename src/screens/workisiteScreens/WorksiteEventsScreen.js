import { StyleSheet, Text, View,FlatList } from "react-native";
import {Context as WorksiteContext} from '../../context/WorksiteContext'
import {Context as AuthContext} from '../../context/AuthContext'
import { useContext, useEffect, useState } from 'react';
import DownloadScreen from '../../components/DownloadScreen';
import { useTranslation } from "react-i18next";
import { calculateWorkHours } from "../../utils/workingHours";


const WorksiteEventsScreen = () => {
  
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [worksiteEvents, setWorksiteEvents] = useState([]) // tallennetaan kaikki tiedot tänne.
    const {state:authState, fetchUserWithId} = useContext(AuthContext);
    const {state, fetchWorksiteDetails} = useContext(WorksiteContext);


    const fetchWorksiteEventsWithUserDetails = async (workDays) => {
        const workdaysWithUserDetails = await Promise.all(
            workDays.map(async (workDay) => {
                // console.log(workDay);
                const userData = await fetchUserWithId(workDay.workerId);
                return {
                    ...workDay,
                    userName: userData ? userData.email : 'N/A',
                     
                }
            })
        )
        const reservedEvents = [...workdaysWithUserDetails].reverse();
        setWorksiteEvents(reservedEvents);
    }
    
    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            // await fetchWorksiteDetails(state.currentWorksite._id);

            let workDays;
            if (authState.user.role === 'admin') {
                workDays = state.currentWorksite.workDays;
                
            } else {
                const userId = authState.user._id;
                
                workDays = state.currentWorksite.workDays.filter(workDay => workDay.workerId === userId);
            }

            await fetchWorksiteEventsWithUserDetails(workDays);
            setIsLoading(false);
        };

        fetchEvents();
    }, [state.currentWorksite, authState.user]);
  


    const renderEmptyComponent = () => {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Ei dataa</Text>
            </View>
        );
        
        
    };

    if (isLoading) {
        return <DownloadScreen message={t('loading')} />
    }


    const isAdmin = authState.user.role === 'admin';
    
    return (
        <View style={styles.container}>
            
            <FlatList 
                data={worksiteEvents}
                keyExtractor={(item) => item._id}
                renderItem={({item}) => (
                    <View style={styles.listContainer}>
                        
                        {item.running ? 
                            <View style={styles.workRunning}>

                                <Text style={styles.text}>{item.userName} - {item.startDate} ({t('worksiteEventScreenRunning')})</Text>
                                <Text style={styles.text}>Työ aloitettu: {item.startDate} -- {item.startTime}</Text>
                            </View> :
                            <View style={styles.workDone}>
                                <View style={styles.header}>
                                    <Text style={styles.text}>{item.userName} - {item.startDate}</Text>
                                </View>
                                <Text style={styles.text}>{t('worksiteEventScreenStartedAt')}: {item.startDate} kello {item.startTime}</Text>
                                <Text style={styles.text}>{t('worksiteEventScreenCompletedAt')}: {item.endDate} kello {item.endTime}</Text>
                                
                                <Text style={styles.text}>{t('worksiteEventScreenSpentTime')} : 
                                    {item.endDate && item.endTime
                                        ? calculateWorkHours(item.startDate, item.startTime, item.endDate, item.endTime, t)
                                        : "Ei saataville"}
                                </Text>
                                 
                            </View>
                        
                        }
                        
                        
                    </View>
                )}
                ListEmptyComponent={renderEmptyComponent}
            />
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
       
    },
    
    title: {
        alignItems: 'center',
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        fontWeight :'600',
        color: 'white',
    },
    listContainer: {
        width: '100%',
        
        
        
    },
    workRunning: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
        margin:5,
    },
    workDone: {
        backgroundColor: '#369236',
        padding: 10,
        borderRadius: 10,
        margin: 5,
    },
    header: {
        
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#5aad57',
        padding: 5,
        marginBottom: 5,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        justifyContent:'center',
        
    },
    emptyText: {
        fontSize: 20,
    }

})

export default WorksiteEventsScreen;