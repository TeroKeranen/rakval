import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Platform, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import CalendarModal from "../../components/CalendarModal";
import { Context as WorksiteContext } from "../../context/WorksiteContext"
import { useContext } from "react";




const CalendarScreen = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [markedDates, setMarkedDates] = useState({})
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    const {state: worksiteState, fetchCalendarEntries} = useContext(WorksiteContext);

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
    }, [worksiteState.currentWorksite, selectedDate]);
    


    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
        const currentMarking = worksiteState.currentWorksite.calendarEntries.find(entry => entry.date === day.dateString);
        setTitle(currentMarking?.title || '');
        setText(currentMarking?.text || '');
        setModalVisible(true);
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

    
  
    
    
      
    return (
        <View style={styles.container}>
            <Calendar onDayPress={onDayPress} markedDates={markedDates}/>

            

            <CalendarModal 
                isVisible={modalVisible} 
                onClose={() => setModalVisible(false)}
                onSave={onSave}
                date={selectedDate}
                title={title}
                setTitle={setTitle}
                text={text}
                setText={setText}
            />
            
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default CalendarScreen;