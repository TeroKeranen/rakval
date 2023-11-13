
import {View, Text, StyleSheet, ActivityIndicator, Alert, Button, Image} from 'react-native'
import {Context as WorksiteContext} from '../../context/WorksiteContext'
import {Context as AuthContext} from '../../context/AuthContext'
import { useContext, useEffect, useState } from 'react';
import DownloadScreen from '../../components/DownloadScreen';
import { useTranslation } from "react-i18next";
import {FLOORPLAN_PHOTO_URL} from '@env'


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
    
    const floorplanKey = state.currentWorksite.floorplanKey;
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text>
            {t("workistedetail-address")}:{state.currentWorksite.address}
          </Text>
          <Text>{floorplanKey}</Text>
          <Text>{t("worksitedetail-city")}</Text>
          <Image source={{ uri: `${FLOORPLAN_PHOTO_URL}${floorplanKey}` }} style={styles.image} />
        </View>

        <View style={styles.buttonContainer}>{isAdmin && <Button title={t("worksitedetail-deleteBtn")} onPress={() => confirmDelete(worksiteId)} />}</View>
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginVertical: 20,
  },
  textContainer: {
    flex: 1,
    backgroundColor: "#e8e8f0",
    width: "90%",
    padding: 40,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    borderWidth: 1,
    marginTop: 20,
  },
  image: {
    
    width: 200,
    height: 200,
    // Muut kuvan tyylit
  },
});

export default WorksiteDetails;