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
        setWorksiteEvents(workdaysWithUserDetails);
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
  


    if (isLoading) {
        return <DownloadScreen message={t('loading')} />
    }


    const isAdmin = authState.user.role === 'admin';
    
    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text>{t('worksiteEventScreenTitle')}</Text>
            </View>
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
                                <Text style={styles.text}>{item.userName} - {item.startDate}</Text>
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
        backgroundColor: '#007400',
        padding: 10,
        borderRadius: 10,
        margin: 5,
    }

})

export default WorksiteEventsScreen;