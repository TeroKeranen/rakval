import { useContext, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Context as WorksiteContext } from "../../context/WorksiteContext";
import {Context as AuthContext} from '../../context/AuthContext'
import DownloadScreen from "../../components/DownloadScreen";

import { StyleSheet, View, Button, Text, FlatList, TouchableOpacity } from "react-native";

const WorkSite = ({navigation}) => {

  const [isLoading, setIsLoading] = useState(false); // Käytetään latausindikaattoria
  const { state, fetchWorksites } = useContext(WorksiteContext);

  // // Käytetään päivittämään työmaalista nappia käyttämällä
  // const handler = () => {
  //   fetchWorksites();
  // };


  // Käytetään navigation focusta joka hakee työmaat uudestaan kun palataan tälle sivulle. // Kommentoin päivitys napin tätä varten jos tulevaisuudessa tulee ongelmia sekä handler function
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchWorksites();
      
      
    });

    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    const loadWorksites = async () => {
      setIsLoading(true);
      await fetchWorksites();
      setIsLoading(false);
    }
    loadWorksites();
  }, []);

  // Käytetään tätä funktiota kun painetaan tietystä työmaasta
  const handlePressWorksite = (worksiteId) => {
    navigation.navigate("WorksiteDetails", { worksiteId });
  };

  // Jos
  if (isLoading) {
    return (
      <DownloadScreen message="Haetaan työmaita"/>
    )
  }

  return (
    <View>
      <Text style={styles.headerText}>WorkSites</Text>
      {state.worksites.length > 0 ? (
        <FlatList
          data={state.worksites}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePressWorksite(item._id)}>
              <View style={styles.worksiteContainer}>
                <Text style={styles.worksiteText}>Osoite: {item.address}</Text>
                <Text style={styles.worksiteText}>Kaupunki: {item.city}</Text>
                {/* Voit lisätä muita tietoja täällä */}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(worksite) => worksite._id}
        />
      ) : (
        <Text style={styles.noWorksiteText}>Ei työmaita</Text>
      )}
      {/* <Button title="päivitä" onPress={handler} /> */}
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
    margin: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: '#3232eb',
    
  },
  worksiteText: {
    fontSize: 18,
    color:'white',
  },
  noWorksiteText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});

export default WorkSite;
