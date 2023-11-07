
import { useContext, useState, useEffect } from "react";
import { Context as CompanyContext } from "../../context/CompanyContext";
import {Context as AuthContext} from '../../context/AuthContext'

import { StyleSheet, View, Button, Text, ActivityIndicator } from "react-native";
import {  Input } from "react-native-elements";
import DownloadScreen from "../../components/DownloadScreen";




const AdminScreen = ({navigation}) => {

  const [isLoading, setIsLoading] = useState(false); // Käytetään latausindikaattoria
  const { state, createCompany, fetchCompany } = useContext(CompanyContext);
  const {fetchUser} = useContext(AuthContext)
  

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  

  useEffect(() => {
    const loadCompany = async () => {
      setIsLoading(true);
      await fetchCompany();
      setIsLoading(false);
    }
    loadCompany();
  }, []);
  
 

  const handleCreateCompany = async () => {
    setIsLoading(true);
    await createCompany({name, address, city})
    await fetchUser();
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <DownloadScreen message="Haetaan yrityksen tietoja" />
    )
  }
  const renderCompanyInfo = () => {
    return (
      <View>
        <Text style={styles.text}>Yrityksen Tiedot:</Text>
        <Text>Nimi: {state.company.name}</Text>
        <Text>Osoite: {state.company.address}</Text>
        <Text>Paikkakunta: {state.company.city}</Text>
        <Text>Koodi: {state.company.code}</Text>
      </View>
    );
  };

  // Funktio lomakkeen renderöintiin
  const renderCreateForm = () => {
    return (
      <View>
        <Text style={styles.text}>Luo yritys</Text>
        <Input placeholder="Yrityksen nimi" value={name} onChangeText={setName} />
        <Input placeholder="Osoite" value={address} onChangeText={setAddress} />
        <Input placeholder="Paikkakunta" value={city} onChangeText={setCity} />
        {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
        {/* <Button title="Luo yritys" onPress={() => createCompany({ name, address, city })} /> */}
        {/* <Button title="Luo yritys" onPress={handleCreateCompany} /> */}
        <Button title="Luo yritys" onPress={handleCreateCompany} />
      </View>
    );
  };

  return (
    <View>
      {state.company ? renderCompanyInfo() : renderCreateForm()}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
});

export default AdminScreen;
