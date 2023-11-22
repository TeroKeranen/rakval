import { useContext, useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet,Alert } from "react-native";
import {Context as WorksiteContext} from '../../context/WorksiteContext';
import {Context as CompanyContext} from '../../context/CompanyContext'
import {Context as AuthContext} from '../../context/AuthContext'
import RNPickerSelect from 'react-native-picker-select'
import { Button } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import ImagePicker from "../../components/ImagePicker";
import DownloadScreen from "../../components/DownloadScreen";


const WorksiteWorkers = () => {
    const { t } = useTranslation();
    const { state: worksiteState, addWorkerToWorksite, fetchWorksiteDetails, fetchWorksites, resetCurrentWorksite, deleteWorksite, deleteWorkerFromWorksite } = useContext(WorksiteContext);
    const {state: companyState, fetchCompany,fetchWorkers} = useContext(CompanyContext);
    const {state: authState, fetchUserWithId} = useContext(AuthContext) // TÄHÄN JÄÄTIIIN

    const [selectedWorker, setSelecterWorker] = useState(null); // Käytetään tätä tallentamaan valittu työntekijä

    const [worksiteWorkers, setWorksiteWorkers] = useState([]) // Tallennetaan työntekijät jotka ovat lisätty työmaahan
    const [isLoading, setIsLoading] = useState(false);
    const isAdmin = authState.user.role;
    

    useEffect(() => {
      fetchCompany();
      
     
      
    }, []);
    
    useEffect(() => {
        if (companyState.company && companyState.company._id) {
            fetchWorkers(companyState.company._id)
        }
        
        
        
    },[companyState.company, authState])

    

    const handleSelectWorker = (workerId) => {
        const worksiteId = worksiteState.currentWorksite._id;
        setSelecterWorker(workerId)
        
    }

    const handleAddWorker = () => {
        if (selectedWorker && worksiteState.currentWorksite) {
            addWorkerToWorksite(worksiteState.currentWorksite._id, selectedWorker);
        }
        setSelecterWorker(null);
        
        
    }

    // kerätään työntekijöiden tiedot ja tallennetaan ne worksiteworkers useStateen
    const fetchAllWorkersInfo = async () => {
      try {
        setIsLoading(true)
        const workersData = await Promise.all(
          worksiteState.currentWorksite.workers.map(async (workerId) => 
            await fetchUserWithId(workerId)
            )
          );
        setWorksiteWorkers(workersData);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      if (worksiteState.currentWorksite && worksiteState.currentWorksite.workers) {
        fetchAllWorkersInfo();
      }
    }, [worksiteState.currentWorksite]);

    const handleRemoveWorker = (workerId) => {
      Alert.alert(
        t("worksiteWorker-markerModal-deletemarker-title"),
        t("worksiteWorker-markerModal-deletemarker-confirmtext"),
        [
          {
            text: t("floorplanscreen-markerModal-deletemarker-cancel"),
            onPress: () => console.log("Peruutettu"),
            style: "cancel",
          },
          {
            text: t("floorplanscreen-markerModal-deletemarker-yes"),
            onPress: () => {
              const worksiteId = worksiteState.currentWorksite._id;
              deleteWorkerFromWorksite(worksiteId, workerId);
            },
          },
        ],
        { cancelable: true }
      );
      
      // Tässä kohtaa voit myös päivittää näkymän poistamalla työntekijän näytöltä
    };

    // Käytetään tätä näyttämään työmaahan lisätyt työntekijät 
    const renderItem = ({ item }) => (
        <View style={styles.workerItem}>
            <Text style={styles.workerText}>{item.email}</Text>
            {/* Lisää muita tietoja tarpeen mukaan */}
            <TouchableOpacity onPress={() => handleRemoveWorker(item._id)}>
              <Ionicons name="trash" size={20}/>
            </TouchableOpacity>

        </View>
    );
    if (isLoading) {
      return <DownloadScreen message="Ladataan" />
    }
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <View style={styles.pickerContainer}>
            <Text style={styles.title}>{t("worksiteWorker-select-worker")}</Text>
            <RNPickerSelect
              onValueChange={handleSelectWorker}
              items={companyState.workers.map((worker) => ({
                label: worker.email, // Tässä voit näyttää haluamasi tiedot työntekijästä
                value: worker._id,
              }))}
              value={selectedWorker}
            />

            <Button title={t("worksiteWorker-add-button")} onPress={handleAddWorker} disabled={!selectedWorker} />
          </View>
          <View style={styles.workersContainer}>
            <Text style={styles.title}>{t("worksiteWorker-workers")}</Text>
            <View style={styles.workers}>
              <FlatList 
                data={worksiteWorkers} 
                renderItem={renderItem} 
                keyExtractor={(item, index) => `worker-${index}`} />
            </View>
            
          </View>
        </View>
      </View>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginVertical: 20,
  },
  textContainer: {
    flex: 1,
    backgroundColor: "#e8e8f0",
    width: "97%",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0edf1",
    width: "100%",
    padding: 40,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  workersContainer: {
    flex: 1,
    
    backgroundColor: "#f0edf1",
    width: "100%",
    padding: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 40,
  },
  workerItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems:'center',
    marginVertical: 10,
    backgroundColor: '#e2dbdb',
    padding: 10,
    borderRadius: 5,
    
  },
  title: {
    fontSize: 20,
  }
});


export default WorksiteWorkers;