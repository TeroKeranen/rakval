import React, { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import DownloadScreen from "./DownloadScreen";
const RestorePurchasesButton = ({setIsLoading, isLoading}) => {

    const {t} = useTranslation();

    // const [isLoading, setIsLoading] = useState(false);

    const handleRestorePurchases = async () => {
        try {
            setIsLoading(true);
            const restoredInfo = await Purchases.restorePurchases();
            const activeEntitlements = Object.keys(restoredInfo.entitlements.active);

            

            if (activeEntitlements.length > 0) {
                Alert.alert(t('succeeded'), t('subscription-screen-restore-success'));
                setIsLoading(false);
              } else {
                Alert.alert(t('fail'), t('subscription-screen-restore-noPurchase'));
                setIsLoading(false);
              }

            
        } catch (error) {
            Alert.alert(t('fail'), t('subscription-screen-restore-failed'));
            setIsLoading(false);
            console.error(error);
        }
    }



    return (

        <TouchableOpacity onPress={handleRestorePurchases} style={styles.button}>
            <Text style={{color: 'white'}}>{t('subscription-screen-restore-btn')}</Text>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#507ab8",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
})

export default RestorePurchasesButton;