import { useContext, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Context as WorksiteContext } from "../../context/WorksiteContext";
import {Context as AuthContext} from '../../context/AuthContext'
import DownloadScreen from "../../components/DownloadScreen";
import { useTranslation } from "react-i18next";

import { StyleSheet, View, Button, Text, FlatList, TouchableOpacity, Pressable } from "react-native";

const WorkSite = ({navigation, route}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false); // Käytetään latausindikaattoria
  const { state, fetchWorksites, resetCurrentWorksite } = useContext(WorksiteContext); 
  const {state: authState, fetchUser} = useContext(AuthContext);

  // // Käytetään päivittämään työmaalista nappia käyttämällä ota käyttöön jos tulee jotain tarvetta
  // const handler = () => {
  //   fetchWorksites();
  // };

  // Käytetään navigation focusta joka hakee työmaat uudestaan kun palataan tälle sivulle. // Kommentoin päivitys napin tätä varten jos tulevaisuudessa tulee ongelmia sekä handler function
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchWorksites();
      
      
    });

    return unsubscribe;
  }, [navigation]); // ehkä ,state,fetchWorksites

  useEffect(() => {
    const loadWorksites = async () => {
      setIsLoading(true);
      await fetchWorksites();
      setIsLoading(false);
      
    };
    loadWorksites();
  }, []);

  // Käytetään tätä funktiota kun painetaan tietystä työmaasta
  const handlePressWorksite = (worksiteId) => {
    navigation.navigate("WorksiteDetails", { worksiteId });
  };

  // Jos
  if (isLoading) {
    return <DownloadScreen message="Haetaan työmaita" />;
  }

  // Käytetään tätä FlatListissä, renderöimaan työmaat joita käyttäjällä on valtuudet nähä
  const visibleWorksitesHandler = () => {
    // Suodatetaan työmaat, joissa käyttäjä on työntekijöiden listalla
    const visibleWorksites = state.worksites.filter((worksite) => worksite.workers.includes(authState.user._id));
    if (authState.user.role === "admin") { // Jos käyttäjällä on admin rooli niin palautetaan kaikki työmaat
      
      return state.worksites;

    } else {
      return visibleWorksites;
    }
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>WorkSites</Text>

      {state.worksites.length > 0 ? (
        <FlatList
          data={visibleWorksitesHandler()}
          renderItem={({ item }) => (

            
            
            <Pressable onPress={() => handlePressWorksite(item._id)} style={({pressed}) => pressed && styles.pressed}>
              <View style={styles.worksiteItem}>
                <View style={styles.worksiteContainer}>
                  <Text style={styles.worksiteText}>
                    {t("workistedetail-address")}: {item.address}
                  </Text>
                  <Text style={styles.worksiteText}>
                    {t("worksitedetail-city")}: {item.city}
                  </Text>
                  {/* Voit lisätä muita tietoja täällä */}
                </View>
              </View>
            </Pressable>
            
          )}
          keyExtractor={(worksite) => worksite._id}
        />
      ) : (
        <Text style={styles.noWorksiteText}>{t("worksite-no-worksites")}</Text>
      )}
      {/* <Button title="päivitä" onPress={handler} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  container : {
    
    marginBottom: 60,
    
    
  },
  worksiteItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
  },

  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  worksiteContainer: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#dad0d0",
    borderRadius: 6,
    elevation: 3,
    shadowColor: "black",
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    width: "90%",
  },
  worksiteText: {
    fontSize: 18,
    color: "#000000",
  },
  noWorksiteText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});

export default WorkSite;
