import { useContext, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Context as WorksiteContext } from "../../context/WorksiteContext";
import {Context as AuthContext} from '../../context/AuthContext'
import DownloadScreen from "../../components/DownloadScreen";
import { useTranslation } from "react-i18next";

import { StyleSheet, View, Button, Text, FlatList, TouchableOpacity, Pressable, Dimensions } from "react-native";

const WorkSite = ({navigation, route}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false); // Käytetään latausindikaattoria
  const [showWorksites, setShowWorksites] = useState(false);
  const [showSmallGigs, setShowSmallGigs] = useState(false);
  const { state, fetchWorksites, resetCurrentWorksite } = useContext(WorksiteContext); 
  const {state: authState, fetchUser} = useContext(AuthContext);

  const errorMessage = state.errorMessage;

  
  
  

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
    return <DownloadScreen message={t('loading')} />;
  }
  if (errorMessage) {
    return <DownloadScreen message={t('loading')} />;
  }

  // Käytetään tätä kun painetaan työmaat nappia, tämä tuo työmaat esille
  const handeleShowWorksites = () => {
    if (showSmallGigs) {
      setShowSmallGigs(false);
    }
    setShowWorksites(prevState => !prevState )
  }

  const handleShowSmallGigs = () => {
    if (showWorksites) {
      setShowWorksites(false);
    }
    setShowSmallGigs(prevState => !prevState);
  }


  // Käytetään tätä FlatListissä, renderöimaan työmaat joita käyttäjällä on valtuudet nähdä
  const visibleWorksitesHandler = () => {
    // Suodatetaan työmaat, joissa käyttäjä on työntekijöiden listalla
    const visibleWorksites = state.worksites.filter((worksite) => 
      authState.user.role === "admin" || worksite.workers.includes(authState.user._id)
    );

    // Erota työmaat tyypin perusteella
    const tyomaat = visibleWorksites.filter(worksite => worksite.worktype === "Construction site");
    const pikkukeikat = visibleWorksites.filter(worksite => worksite.worktype === "Private client");

    return { tyomaat, pikkukeikat };
  };

  const { tyomaat, pikkukeikat } = visibleWorksitesHandler();

  const renderWorksite = ({ item }) => (
    <Pressable onPress={() => handlePressWorksite(item._id)} style={({pressed}) => pressed && styles.pressed}>
      <View style={styles.worksiteItem}>
        <View style={styles.worksiteContainer}>
          <Text style={styles.worksiteText}>
            {t("workistedetail-address")}: {item.address}
          </Text>
          <Text style={styles.worksiteText}>
            {t("worksitedetail-city")}: {item.city}
          </Text>
          <Text style={styles.worksiteText}>
            tyyppi: {item.worktype}
          </Text>
          {/* Voit lisätä muita tietoja täällä */}
        </View>
      </View>
    </Pressable>
  );
  
  return (
    <View style={styles.container}>
      
      
      <View style={styles.selectJobtype}>
        <TouchableOpacity onPress={handeleShowWorksites} style={[styles.jobTypeButton, showWorksites ? styles.selectedJobType: null]}>
          <Text style={[styles.jobTypeButtonText, showWorksites ? styles.selectedJobTypeButtonText : null]}>{t('worksiteform-worktype-worksite')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShowSmallGigs} style={[styles.jobTypeButton, showSmallGigs ? styles.selectedJobType: null]}>
          <Text style={[styles.jobTypeButtonText, showSmallGigs ? styles.selectedJobTypeButtonText : null]}>{t('worksiteform-worktype-privateClient')}</Text>
        </TouchableOpacity>
      </View>

      {/* {errorMessage && <DownloadScreen message={t('loading')}/>} */}

      {showWorksites && (

      tyomaat.length > 0 ? (
        <View style={styles.woksiteContainer}>

          <FlatList
            data={tyomaat}
            renderItem={renderWorksite}
            keyExtractor={(worksite) => `tyomaa-${worksite._id}`}
            
            />
        </View>
      ) : (
        <Text style={styles.noWorksiteText}>{t("worksite-no-worksites")}</Text>
      )
      )}

      {showSmallGigs && (

      pikkukeikat.length > 0 ? (
        <View style={styles.woksiteContainer}>

          <FlatList
            data={pikkukeikat}
            renderItem={renderWorksite}
            keyExtractor={(worksite) => `pikkukeikka-${worksite._id}`}
            
            
            />
        </View>
      ) : (
        <Text style={styles.noWorksiteText}>{t("worksite-no-worksites")}</Text>
      )
      )}
    </View>
 
  );
};


const phoneHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  container : {
    flex: 1,
    height: phoneHeight,
    
    
    
  },
  woksiteContainer: {
    flex: 2,
    
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
  selectJobtype: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  jobTypeButton: {
    backgroundColor: "#74777c",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        // width: "50%",
        alignItems: "center",
        alignSelf:'center',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection:'row'
  },
  selectedJobType: {
    backgroundColor: "#507ab8",
  },
  jobTypeButtonText: {
    color: 'white',
  },
  selectedJobTypeButtonText: {
    color: '#ffffff'
  }
});

export default WorkSite;
