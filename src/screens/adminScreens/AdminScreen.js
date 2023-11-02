
import { useContext, useState, useEffect } from "react";
import { Context as CompanyContext } from "../../context/CompanyContext";

import { StyleSheet, View, Button, Text } from "react-native";
import {  Input } from "react-native-elements";




const AdminScreen = ({navigation}) => {
  const { state, createCompany, fetchCompany } = useContext(CompanyContext);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    fetchCompany();
    
  }, []);

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
        <Button title="Luo yritys" onPress={() => createCompany({ name, address, city })} />
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
