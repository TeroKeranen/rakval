import { useContext } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {calculateTotaWorkTime} from '../../utils/workingHours'
import { useTranslation } from "react-i18next";


const WorksiteReady = ({worksites, title}) => {

  
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          

          <FlatList
            data={worksites}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{paddingBottom: 200}}
            renderItem={({ item }) => {
              const totalWorkTime = calculateTotaWorkTime(item.workDays);
              return (
                
                <View style={styles.renderContainer}>
                <Text >{t('worksiteform-city')}: {item.city}</Text>
                <Text >{t('worksiteform-address')}: {item.address}</Text>
                {item.startTime && <Text >{t('startingDate')}: {item.startTime}</Text>}
                <Text >{t('workHours')}: {totalWorkTime}</Text>
                
                

                
              </View>
              )
            }}/>
            
        </View>
      );
    

}

const styles = StyleSheet.create({
  container: {
    
    width: '90%',
    borderRadius: 5,
    
    
  },
 
  title: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '600'
  },
  renderContainer: {
    alignSelf: 'center',
      backgroundColor: '#ddd4d4',
      width: '90%',
      marginVertical: 6,
      padding: 10,
      borderRadius: 10,
      elevation: 3,
      shadowColor: "black",
      shadowRadius: 4,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.4,
    
  }
})


export default WorksiteReady;