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
            renderItem={({ item }) => {
              const totalWorkTime = calculateTotaWorkTime(item.workDays);
              return (

              <View style={styles.renderContainer}>
                <Text>{t('worksiteform-city')}: {item.city}</Text>
                <Text>{t('worksiteform-address')}: {item.address}</Text>
                {item.startTime && <Text>{t('startingDate')}: {item.startTime}</Text>}
                <Text>{t('workHours')}: {totalWorkTime}</Text>
                
                

                
              </View>
              )
}}/>
        </View>
      );
    

}

const styles = StyleSheet.create({
  container: {
  },
  title: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '600'
  },
  renderContainer: {
    borderWidth: 1,
    padding: 8,
    margin: 3,
    borderRadius: 3,
    
  }
})


export default WorksiteReady;