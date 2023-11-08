import { useState } from "react";
import { StyleSheet, View, Button } from "react-native";
import { Text,  Input } from "react-native-elements";
import { useTranslation } from "react-i18next";



const WorksiteForm = ({onSubmit, errorMessage}) => {
    const { t } = useTranslation();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");

    const handleSubmit = async () => {
        try {
            await onSubmit({address, city})
            // nollataan input kentät onnistunee lisäyksen jälkeen
            setAddress(''),
            setCity('');
        } catch (error) {
            console.log(error);
        }
    }

    return (
      <>
        <Text style={styles.text}>{t('worksiteform-title')}</Text>

        <Input style={styles.input} placeholder={t('worksiteform-address')} value={address} onChangeText={setAddress} />

        <Input style={styles.input} placeholder={t('worksiteform-city')} value={city} onChangeText={setCity} />

        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

        <Button  title={t('worksiteform-button')} onPress={handleSubmit} />
      </>
    );

    
};

const styles = StyleSheet.create({
    errorMessage: {
        fontSize: 16,
        color: 'red',
    },
    text: {
        alignSelf: 'center',
        marginBottom: 50,
        fontSize: 20,
    },
    button: {
        width: '50%'
    }
});

export default WorksiteForm;
