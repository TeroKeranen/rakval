import { useContext, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Context as WorksiteContext } from "../../context/WorksiteContext";
import {Context as AuthContext} from '../../context/AuthContext'

import { StyleSheet, View, Button, Text, FlatList } from "react-native";

const WorkSite = () => {

  const {state, fetchWorksites} = useContext(WorksiteContext);

 
  const handler = () => {
    fetchWorksites();
  }
  useEffect(() => {

    

      fetchWorksites()
       
  }, [state.length])

  console.log(state); 

   const renderItem = ({ item }) => {
     return (
       <View style={styles.worksiteContainer}>
         <Text style={styles.worksiteText}>Osoite: {item.address}</Text>
         <Text style={styles.worksiteText}>Kaupunki: {item.city}</Text>
         {/* Voit lisätä muita tietoja täällä */}
       </View>
     );
   };
 

  
  return (
    <View>
      <Text style={styles.headerText}>WorkSites</Text>
      {state.worksites.length > 0 ? (

        <FlatList data={state.worksites} renderItem={renderItem} keyExtractor={(worksite) => worksite._id} />
      ) : (
        <Text style={styles.noWorksiteText}>Ei työmaita</Text>
      )}
      <Button title="päivitä" onPress={handler}/>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  worksiteContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  worksiteText: {
    fontSize: 18,
  },
  noWorksiteText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});

export default WorkSite;
