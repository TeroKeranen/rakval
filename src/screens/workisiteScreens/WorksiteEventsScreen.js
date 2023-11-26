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
                console.log("minä olen admin")
            } else {
                const userId = authState.user._id;
                console.log("minä olen user")
                workDays = state.currentWorksite.workDays.filter(workDay => workDay.workerId === userId);
            }

            await fetchWorksiteEventsWithUserDetails(workDays);
            setIsLoading(false);
        };

        fetchEvents();
    }, [state.currentWorksite, authState.user]);
  


    if (isLoading) {
        return <DownloadScreen message="ladataan" />
    }


    const isAdmin = authState.user.role === 'admin';
    
    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text>EVENTS</Text>
            </View>
            <FlatList 
                data={worksiteEvents}
                keyExtractor={(item) => item._id}
                renderItem={({item}) => (
                    <View style={styles.listContainer}>

                        {item.running ? 
                            <View style={styles.workRunning}>
                                <Text>{item.userName} - {item.startDate} (työ Käynnissä)</Text>
                                <Text>Työ aloitettu: {item.startDate} klo {item.startTime}</Text>
                            </View> :
                            <View style={styles.workDone}>
                                <Text>{item.userName} - {item.startDate}</Text>
                                <Text>Tehty työ: </Text>
                                <Text>{item.startDate} - {item.startTime} --- {item.endDate}-{item.endTime}</Text>
                                <Text>työhön menny aika : {calculateWorkHours(item.startDate, item.startTime, item.endDate, item.endTime)}</Text>
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
        borderWidth: 1,
        borderColor: 'red',
    },
    title: {
        alignItems: 'center',
        marginVertical: 10,
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
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 10,
        margin: 5,
    }

})

export default WorksiteEventsScreen;