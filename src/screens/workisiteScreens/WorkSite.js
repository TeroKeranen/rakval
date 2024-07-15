import { useContext, useState, useEffect } from "react";
// import { useFocusEffect } from "@react-navigation/native";
import { Context as WorksiteContext } from "../../context/WorksiteContext";
import {Context as AuthContext} from '../../context/AuthContext'
import DownloadScreen from "../../components/DownloadScreen";
import { useTranslation } from "react-i18next";

import { StyleSheet, View, Button, Text, FlatList,RefreshControl, TouchableOpacity, Pressable, Dimensions, ImageBackground } from "react-native";

const WorkSite = ({navigation, route}) => {

  
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false); // Käytetään latausindikaattoria
  const [showWorksites, setShowWorksites] = useState(false);
  const [showSmallGigs, setShowSmallGigs] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);


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
      if (authState.user.company != null) {

        fetchWorksites();
      }
      
      
    });

    return unsubscribe;
  }, [navigation]); // ehkä ,state,fetchWorksites

  useEffect(() => {
    const loadWorksites = async () => {
      setIsLoading(true);
      if (authState.user.company != null) {

        await fetchWorksites()
          .then(result => {
            setIsLoading(false);
          })
          .catch(error => {
            
            setIsLoading(false);
          })
      }
      
    };
    loadWorksites();
    setIsLoading(false);
  }, []);

  const onRefresh =  async () => {
    setIsRefreshing(true); // Aseta päivitystila todeksi
    await fetchWorksites().then(result => {
      
      setIsRefreshing(false); // Aseta päivitystila epätodeksi, kun olet valmis
    })
    .catch(error => {
      console.error('Failed to refresh events:', error);
      
      setIsRefreshing(false); // Aseta päivitystila epätodeksi, jos tulee virhe
    });
  }

  // Käytetään tätä funktiota kun painetaan tietystä työmaasta
  const handlePressWorksite = (worksiteId) => {
    navigation.navigate("WorksiteDetails", { worksiteId });
  };

  if (authState.user.company == null) {
    return (
      
      <View style={styles.noCompanyContainer}>
        <Text style={styles.noCompany}>{authState.user.role === 'admin' ? t('noCompanyAdmin') : t('noCompanyUser')}</Text>
      </View>
    )
  }
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
    const tyomaat = visibleWorksites.filter(worksite => (worksite.worktype === "Construction site" || worksite.worktype === "Työmaa"));
    
    const pikkukeikat = visibleWorksites.filter(worksite => (worksite.worktype === "Private client" || worksite.worktype === "Yksityisasiakas"));
    
    return { tyomaat, pikkukeikat };
  };

  const { tyomaat, pikkukeikat } = visibleWorksitesHandler();

  const renderWorksite = ({ item }) => (
    
    <Pressable onPress={() => handlePressWorksite(item._id)} style={({pressed}) => pressed && styles.pressed}>
      <View style={styles.worksiteItem}>
        <View style={[styles.worksiteContainer, item.isReady && styles.readyWorksite]}>
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
    <ImageBackground
          source={require('../../../assets/logo-color.png')}
          
          style={styles.background}
        >
      <View style={styles.overlay}>
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
                refreshing={isRefreshing}  // Päivitysindikaattorin tila
                onRefresh={onRefresh}      // Päivitysmetodi
                keyExtractor={(worksite) => `tyomaa-${worksite._id}`}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    tintColor="white" // Asettaa päivitysindikaattorin värin valkoiseksi
                  />
                }
                
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
                refreshing={isRefreshing}  // Päivitysindikaattorin tila
                onRefresh={onRefresh}      // Päivitysmetodi
                keyExtractor={(worksite) => `pikkukeikka-${worksite._id}`}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    tintColor="white" // Asettaa päivitysindikaattorin värin valkoiseksi
                  />
                }
                
                
                />
            </View>
          ) : (
            <Text style={styles.noWorksiteText}>{t("worksite-no-worksites")}</Text>
          )
        )}
        </View>
    </View>
  </ImageBackground>
  );
};


const phoneHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  background: {
    flex: 1, // Varmista, että ImageBackground täyttää koko näytön
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(40, 42, 54, 0.1)',  // Määritä väri ja läpinäkyvyys tarpeen mukaan
  },
  pressed: {
    opacity: 0.75,
  },
  readyWorksite: {
    backgroundColor: '#60a360', // Taustaväri vihreäksi valmiille työmaille
    
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
    justifyContent: 'space-evenly'
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
  },
  noCompanyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '80%',
    
  },
  noCompany: {

    textAlign: 'center',
    marginTop: 20,
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default WorkSite;
