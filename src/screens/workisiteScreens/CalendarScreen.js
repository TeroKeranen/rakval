import { useEffect, useState,useContext } from "react";
import { StyleSheet, Text, View, Button, Platform, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import CalendarModal from "../../components/CalendarModal";
import { Context as WorksiteContext } from "../../context/WorksiteContext"
import { Context as AuthContext } from "../../context/AuthContext"

import { useTranslation } from "react-i18next";



const CalendarScreen = () => {


    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState('');
    const [markedDates, setMarkedDates] = useState({})
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [buttonsVisible, setButtonsVisible] = useState(false); // tämän avulla näytetään buttonit
    const [selectedEntries, setSelectedEntries] = useState([]); // Uusi tila valituille merkinnöille

    const {state: worksiteState, fetchCalendarEntries} = useContext(WorksiteContext);
    const {state: authState} = useContext(AuthContext)
    const isAdmin = authState.user.role === 'admin'||authState.user.role === 'superAdmin';
    const token = authState;
    
    
    

    useEffect(() => {
        // // console.log(worksiteState.currentWorksite.calendarEntries)
        if (worksiteState.currentWorksite && worksiteState.currentWorksite._id) {
            fetchCalendarEntries(worksiteState.currentWorksite._id);
        }
    }, [worksiteState.currentWorksite?._id])


    useEffect(() => {
        const newMarkedDates = {};
        if (worksiteState.currentWorksite && worksiteState.currentWorksite.calendarEntries) {
            worksiteState.currentWorksite.calendarEntries.forEach(entry => {
                newMarkedDates[entry.date] = {
                    selected: selectedDate === entry.date,
                    marked: true,
                    dotColor: 'blue',
                    title: entry.title,
                    text: entry.text
                };
            });
        }
        setMarkedDates(newMarkedDates);
    }, [worksiteState.currentWorksite]);
    


    const onDayPress = (day) => {
        
        setSelectedDate(day.dateString);

        // const newMarkedDates = {
        //     ...markedDates,
        //     [day.dateString]: { 
        //         selected: true, 
                
        //         selectedColor: 'blue'
        //     }
        // };

        const newMarkedDates = {...markedDates};
        Object.keys(newMarkedDates).forEach((date) => {
            newMarkedDates[date].selected = false;
        });

        newMarkedDates[day.dateString] = { 
            ...newMarkedDates[day.dateString],
            selected: true, 
            selectedColor: 'blue'
        };
        setMarkedDates(newMarkedDates);

        const currentMarking = worksiteState.currentWorksite.calendarEntries.filter(entry => entry.date === day.dateString);
        

        if (currentMarking) {

            setSelectedEntries(currentMarking)
            // setTitle(currentMarking?.title || '');
            // setText(currentMarking?.text || '');
            setButtonsVisible(true);
        } else {
            setSelectedEntries(null);
            // setTitle('');
            // setText('');
            setButtonsVisible(false);
        }
        
        
        // setModalVisible(true);
    };

    const onSave = (newTitle, newText) => {
        const newMarkedDates = {
            ...markedDates, [selectedDate] : {
                selected: true,
                marked: true,
                selectedColor: 'blue',
                title:newTitle,
                text: newText
            }
        }
        setMarkedDates(newMarkedDates);
        setModalVisible(false);
    }

    
  
    const openCalendarMark = () => {
        
        setModalVisible(true);
        setIsEditing(false);
    }

    const addNewCalendarMark = () => {

        setTitle('');
        setText('');
        setModalVisible(true);
        setIsEditing(true);


    }
    
      
    return (
        <View style={styles.container}>
            <Calendar onDayPress={onDayPress} markedDates={markedDates}/>

           

            {
                buttonsVisible && selectedDate && (
                    <View>
                        {/* Tarkista onko valitulle päivälle merkintöjä */}
                        {selectedEntries && selectedEntries.length > 0 ? (
                            <>
                                {/* Näytä "avaa merkinnät" -nappi, jos on merkintöjä */}
                                <TouchableOpacity style={styles.workDaybutton} onPress={openCalendarMark}>
                                    <Text style={{color: 'white'}}>{t('calenderScreenOpenEntries')}</Text>
                                </TouchableOpacity>
                            </>
                        ) : null}

                        {/* Näytä "lisää merkintä" -nappi aina, kun päivämäärä on valittu */}
                        <TouchableOpacity style={styles.workDaybutton} onPress={addNewCalendarMark}>
                            <Text style={{color: 'white'}}>{t('calenderScreenAddNewMark')}</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            


            <CalendarModal 
                isVisible={modalVisible} 
                onClose={() => setModalVisible(false)}
                onSave={onSave}
                date={selectedDate}
                setSelectedDate={setSelectedDate}
                title={title}
                setTitle={setTitle}
                text={text}
                setText={setText}
                isEditing={isEditing}
                entries={selectedEntries}
                isAdmin={isAdmin}
            />
            
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    workDaybutton: {
        backgroundColor: "#507ab8",
            padding: 10,
            borderRadius: 5,
            marginVertical: 10,
            // width: "50%",
            alignItems: "center",
            alignSelf:'center',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
      }
})

export default CalendarScreen;