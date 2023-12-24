import { Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Context as WorksiteContext } from "../context/WorksiteContext";
import { useContext, useEffect, useState } from "react";


const CalendarModal = ({isVisible, onClose, onSave, title, date, setTitle, text, setText}) => {

    const {state: worksiteState, saveCalendarEntry,fetchCalendarEntries,updateCalendarEntry, deleteCalendarEntry} = useContext(WorksiteContext)
    const [isEditing, setIsEditing] = useState(false);
    const [existingEntry, setExistingEntry] = useState(null);
    // console.log("calendarModal", worksiteState);

    useEffect(() => {
        // etsitään onko päivämäärällä jo oleva merkintä
        const entry = worksiteState.currentWorksite.calendarEntries.find(entry => entry.date === date);
        if (entry) {
            setExistingEntry(entry);
            setTitle(entry.title);
            setText(entry.text);
            setIsEditing(false);
        } else {
            setExistingEntry(null);
            setTitle('');
            setText('');
            setIsEditing(true);
        }
    },[date, worksiteState.currentWorksite.calendarEntries, setTitle, setText]) 

    // const handleSave = async () => {

        
    //     const worksiteId = worksiteState.currentWorksite._id;
    //     await saveCalendarEntry(worksiteId, date, title,text);
    //     onSave(title, text);
    //     fetchCalendarEntries(worksiteId);
    //     onClose();
        
        
        
    // }
    const handleSave = async () => {
        const worksiteId = worksiteState.currentWorksite._id;
        if (existingEntry) {
            await updateCalendarEntry(worksiteId, existingEntry._id, date, title, text);
        } else {
            await saveCalendarEntry(worksiteId, date, title, text);
        }
        onSave(title, text);
        fetchCalendarEntries(worksiteId);
        onClose();
    };

    const handleDelete = async () => {
        const worksiteId = worksiteState.currentWorksite._id;
        
        await deleteCalendarEntry(worksiteId, existingEntry._id, date);
        onClose();
    }

    return (
        <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
            <View style={styles.container}>
                
                <View style={styles.modalView}>
                
                    {/* <TextInput style={styles.input} placeholder="Otsikko" value={title} onChangeText={setTitle}/> */}
                    <TextInput style={styles.input} placeholder="Otsikko" value={title} onChangeText={isEditing ? setTitle : undefined} editable={isEditing}/>
                    {/* <TextInput style={styles.input} placeholder="Teksti" value={text} onChangeText={setText}/> */}
                    <TextInput style={styles.input} placeholder="Teksti" value={text} onChangeText={isEditing ? setText : undefined} editable={isEditing}/>
                    {/* <Button title="tallenna" onPress={handleSave}/> */}
                    {isEditing ? (
                        <Button title="Tallenna" onPress={handleSave}/>
                    ) : (
                        <View>

                            <Button  title="Muokkaa" onPress={() => setIsEditing(true)}/>
                            <Button title="Poista" onPress={handleDelete}/>
                        </View>
                    )}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#f5f5f5" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        paddingVertical: 35,
        paddingHorizontal: 55,
        width: "90%",
        height: '70%',
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
    closeButton: {
        position: "absolute",
        right: 0,
        top: 0,
        padding: 10,
        backgroundColor: "#5656e2",
        borderTopRightRadius: 20,
      },
})


export default CalendarModal;