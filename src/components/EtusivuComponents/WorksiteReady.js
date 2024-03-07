import { useContext } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {calculateTotaWorkTime} from '../../utils/workingHours'



const WorksiteReady = ({worksites, title}) => {

  


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
                <Text>Kaupunki: {item.city}</Text>
                <Text>Osoite: {item.address}</Text>
                {item.startTime && <Text>Ajankohta: {item.startTime}</Text>}
                <Text>kok: {totalWorkTime}</Text>
                
                

                
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