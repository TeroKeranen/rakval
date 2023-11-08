
import {View, Text, StyleSheet, ActivityIndicator, Alert, Button} from 'react-native'
import {Context as WorksiteContext} from '../../context/WorksiteContext'
import {Context as AuthContext} from '../../context/AuthContext'
import { useContext, useEffect, useState } from 'react';
import DownloadScreen from '../../components/DownloadScreen';
import { useTranslation } from "react-i18next";


const WorksiteDetails = ({route, navigation}) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const {worksiteId} = route.params;
    const { state, fetchWorksiteDetails,fetchWorksites, resetCurrentWorksite,deleteWorksite } = useContext(WorksiteContext);
    const { state:authState} = useContext(AuthContext); // Etsitään käyttäjän tiedot
    const isAdmin = authState.user && authState.user.role ==='admin'; // jos on käyttäjä ja rooli on admin === true

    
    //Q999nNAyCg
    useEffect(() => {
      
      async function loadDetails () {
        try {
          setIsLoading(true);
          await fetchWorksiteDetails(worksiteId);
          
        } catch (error) {
          console.log(error);     
        } finally {
          setIsLoading(false);
        }   
      }
      loadDetails();          
    },[worksiteId])

    const confirmDelete = (worksiteId) => {
      Alert.alert(t("worksitedetail-deleteBtn"), t("worksitedetail-confirmdelete"), [
        { text: t("worksitedetail-confirmDelete-cancelButton"), style: "cancel" },
        {
          text: t("worksitedetail-confirmDelete-deleteButton"),
          onPress: () =>
            deleteWorksite(worksiteId, () => {
              navigation.goBack();
            }),
        },
      ]);
    }
  
    if (isLoading) {
      return (

        <DownloadScreen message={t('worksitedetail-downloadscreen-msg')} />
      )
           
    }
    

    return (
      <View>
        {isAdmin && <Button title={t("worksitedetail-deleteBtn")} onPress={() => confirmDelete(worksiteId)} />}
        {/* <Button title="Poista työmaa" onPress={handleDelete}/> */}
        <Text>
          {t("workistedetail-address")}:{state.currentWorksite.address}{" "}
        </Text>
        {/* <Text>Kaupunki: {state.currentWorksite.city} </Text> */}
        <Text>{t("worksitedetail-city")}</Text>
        {/* Lisää muita yksityiskohtia tähän */}
      </View>
    );
}


const styles = StyleSheet.create({
  
});

export default WorksiteDetails;