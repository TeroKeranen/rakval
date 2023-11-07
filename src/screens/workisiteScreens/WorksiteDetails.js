
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native'
import {Context as WorksiteContext} from '../../context/WorksiteContext'
import { useContext, useEffect, useState } from 'react';
import DownloadScreen from '../../components/DownloadScreen';


const WorksiteDetails = ({route}) => {
    
    const [isLoading, setIsLoading] = useState(false);
    const {worksiteId} = route.params;
    const { state, fetchWorksiteDetails, resetCurrentWorksite } = useContext(WorksiteContext);

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

        <DownloadScreen message="Ladataan työmaan tietoja" />
      )
           
    }
    

    return (
      <View>
        <Text>Osoite:{state.currentWorksite.address} </Text>
        {/* <Text>Kaupunki: {state.currentWorksite.city} </Text> */}
        <Text>Kaypunki</Text>
        {/* Lisää muita yksityiskohtia tähän */}
      </View>
    );
}


const styles = StyleSheet.create({
  
});

export default WorksiteDetails;