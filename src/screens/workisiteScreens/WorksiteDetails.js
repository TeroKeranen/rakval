
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native'
import {Context as WorksiteContext} from '../../context/WorksiteContext'
import { useContext, useEffect, useState } from 'react';
import DownloadScreen from '../../components/DownloadScreen';
import { useTranslation } from "react-i18next";


const WorksiteDetails = ({route}) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const {worksiteId} = route.params;
    const { state, fetchWorksiteDetails,fetchWorksites, resetCurrentWorksite } = useContext(WorksiteContext);

    

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
    
    if (isLoading) {
      return (

        <DownloadScreen message={t('worksitedetail-downloadscreen-msg')} />
      )
           
    }
    

    return (
      <View>
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