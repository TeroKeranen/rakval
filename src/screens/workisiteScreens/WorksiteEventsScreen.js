import { StyleSheet, Text, View,FlatList } from "react-native";
import {Context as WorksiteContext} from '../../context/WorksiteContext'
import {Context as AuthContext} from '../../context/AuthContext'
import { useContext, useEffect, useState } from 'react';
import DownloadScreen from '../../components/DownloadScreen';
import { useTranslation } from "react-i18next";


const WorksiteEventsScreen = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [worksiteEvents, setWorksiteEvents] = useState([]) // tallennetaan kaikki tiedot tänne.
    const {state:authState, fetchUserWithId} = useContext(AuthContext);
    const {state, fetchWorksiteDetails} = useContext(WorksiteContext);


    const fetchWorksiteEventsWithUserDetails = async () => {
        const workdaysWithUserDetails = await Promise.all(
            state.currentWorksite.workDays.map(async (workDay) => {
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
        console.log(worksiteEvents);
        setIsLoading(true);
        fetchWorksiteDetails();
        fetchWorksiteEventsWithUserDetails().then(() => setIsLoading(false));
    }, [state.currentWorksite]);

    // useEffect(() => {
    //     const loadEvents = async () => {
    //         setIsLoading(true);
    //         await fetchWorksiteDetails();
    //         setIsLoading(false);
    //     }

    //     loadEvents();
    // }, [])


    if (isLoading) {
        return <DownloadScreen message="ladataan" />
    }

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
                                <Text>{item.userName} - {item.date}</Text>
                                <Text>Työ aloitettu: {item.date} klo {item.startTime}</Text>
                            </View> :
                            <View style={styles.workDone}>
                                <Text>{item.userName} - {item.date}</Text>
                                <Text>Tehty työ: {item.startTime} - {item.endTime}</Text>
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
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 10,
        margin:5,
    },
    workDone: {
        backgroundColor: '#797439',
        padding: 10,
        borderRadius: 10,
        margin: 5,
    }

})

export default WorksiteEventsScreen;