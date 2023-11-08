
import { Modal, Text, TouchableOpacity, View, FlatList } from "react-native";
import i18next, { languageResources } from "../../services/i18n"
import {useTranslation} from 'react-i18next'
import { useState } from "react";
import languageList from '../../services/languagesList.json'


const ChangeLanguage = () => {
    const {t} = useTranslation();
    const [visible, setVisible] = useState(false);

    const changeLng = (lng) => {
        i18next.changeLanguage(lng);
        setVisible(false);
    }

    return (
        <View>
            <Modal visible={visible} onRequestClose={() => setVisible(false)}>
                <View>
                    <FlatList 
                        data={Object.keys(languageResources)} 
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={() => changeLng(item)}>
                                <Text>{languageList[item].nativeName}</Text>
                            </TouchableOpacity> 
                            )}/>
                </View>
            </Modal>

            <TouchableOpacity onPress={() => setVisible(true)}>
                <Text>{t('change-language')}</Text>
            </TouchableOpacity>
        </View>
    )

}


export default ChangeLanguage;