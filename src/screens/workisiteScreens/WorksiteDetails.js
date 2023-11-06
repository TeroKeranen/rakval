
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native'
import {Context as WorksiteContext} from '../../context/WorksiteContext'
import { useContext, useEffect } from 'react';


const WorksiteDetails = ({route}) => {
    
    const {worksiteId} = route.params;
    const { state, fetchWorksiteDetails, resetCurrentWorksite } = useContext(WorksiteContext);

    useEffect(() => {
      resetCurrentWorksite(); // tyhjennetään edellisen työmaantiedot näkyvistä
      fetchWorksiteDetails(worksiteId) // Etsitään työmaantiedot
      
    },[worksiteId])
    
    if (!state.currentWorksite) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" /> 
          <Text>Ladataan työmaan tietoja...</Text>
        </View>
      );
    }
    return (
      <View>
        <Text>Osoite:{state.currentWorksite.address} </Text>
        <Text>Kaupunki: {state.currentWorksite.city} </Text>
        {/* Lisää muita yksityiskohtia tähän */}
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Keskittää sisällön pystysuunnassa
    alignItems: "center", // Keskittää sisällön vaakasuunnassa
    padding: 20,
  },
});

export default WorksiteDetails;