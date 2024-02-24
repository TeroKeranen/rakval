import { Button, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Context as WorksiteContext } from "../context/WorksiteContext";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DownloadScreen from "./DownloadScreen";


const CalendarModal = ({isVisible, onClose, onSave, title, date,setSelectedDate, setTitle, text,entries, setText, isEditing,isAdmin}) => {

    const { t } = useTranslation();
    const {state: worksiteState, saveCalendarEntry,fetchCalendarEntries,updateCalendarEntry, deleteCalendarEntry} = useContext(WorksiteContext)
    
    const [existingEntry, setExistingEntry] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // const [selectedEntry, setSelectedEntry] = useState(null);
    

    useEffect(() => {
        // etsitään onko päivämäärällä jo oleva merkintä
        const entry = worksiteState.currentWorksite.calendarEntries.find(entry => entry.date === date);
        if (entry) {
            setExistingEntry(entry);
            setTitle(entry.title);
            setText(entry.text);
            // setIsEditing(false);
            isEditing = false;
        } else {
            setExistingEntry(null);
            setTitle('');
            setText('');
            // setIsEditing(true);
            isEditing = true;
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
        setIsLoading(true);
        try {
            const worksiteId = worksiteState.currentWorksite._id;
            await saveCalendarEntry(worksiteId, date, title, text);
            onSave(title, text);
            fetchCalendarEntries(worksiteId);
            setSelectedDate('')
            onClose();
            
        } catch (error) {
            console.log("Errorrrorororo calendarModal");
        }
        setIsLoading(false);
        
    };

    const handleDelete = (entryId) => async () => {
        const worksiteId = worksiteState.currentWorksite._id;
        setIsLoading(true);
        try {
            await deleteCalendarEntry(worksiteId, entryId, date);
            
            onClose();
            
        } catch (error) {
            console.log("handledelete calendarmodal")
        }
        setSelectedDate('');
        setIsLoading(false);
        
    }

    if (isLoading) {
        return (
            <DownloadScreen message={t('loading')} />
        )
      }

    return (
        <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
            <View style={styles.container}>
                
            <View style={styles.modalView}>
                    {isEditing ? (
                        <>
                            <View style={styles.inputView}>

                                <TextInput
                                    style={styles.titleInput}
                                    placeholder={t('title')}
                                    value={title}
                                    onChangeText={setTitle}
                                    editable={true}
                                    />
                                <TextInput
                                    style={styles.bodyInput}
                                    placeholder={t('text')}
                                    value={text}
                                    onChangeText={setText}
                                    editable={true}
                                    multiline={true}
                                    textAlignVertical="top"
                                    
                                    />
                            </View>
                            <View style={styles.buttonView}>
                                <Button title={t('save')} onPress={handleSave}/>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.entries}>

                                <ScrollView>
                                    {entries.map(entry => (

                                        <View style={styles.singleMark}  key={entry._id}>
                                            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                                                <Text style={styles.markTitle}>{entry.title}</Text>
                                                {/* <Button title="Poista" onPress={handleDelete(entry._id)}/> */}
                                                {isAdmin && <TouchableOpacity onPress={handleDelete(entry._id)}>
                                                    <Ionicons name="trash" size={20} />
                                                </TouchableOpacity>}
                                                
                                            </View>
                                            <View>
                                                <Text style={styles.markText}>{entry.text}</Text>
                                            </View>
                                            
                                            
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                            {/* <Text style={styles.text}>{title}</Text>
                            <Text style={styles.text}>{text}</Text>
                            <Button title="Muokkaa" onPress={() => isEditing = true}/>
                            <Button title="Poista" onPress={handleDelete}/> */}
                        </>
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
      entries: {
        
        width: '100%',
        marginTop: 15,
      },
      singleMark: {
        margin: 5,
        padding: 3,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 5,
      },
      markTitle: {
        fontWeight : "bold",
        
      },
      markText: {
        
      },
      inputView: {
        flex: 1,
        
        width: '100%',
        padding: 2,
      },
      buttonView: {

      },
      titleInput: {
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 3,
        padding: 3,
        
      },
      bodyInput: {
        borderWidth: 1,
        padding: 3,
        borderRadius: 3,
        height: '50%'
      }
})


export default CalendarModal;