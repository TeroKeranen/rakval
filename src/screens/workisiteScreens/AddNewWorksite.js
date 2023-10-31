
import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import {Context as WorksiteContext} from '../../context/WorksiteContext'
import { useContext, useState } from "react";


const AddNewWorksite = ({navigation}) => {

  const {state, newWorksite} = useContext(WorksiteContext);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  return (
    <View>
      <Text style={styles.text}>add new work site</Text>

      <TextInput style={styles.input} placeholder="address" value={address} onChangeText={setAddress} />

      <TextInput style={styles.input} placeholder="city" value={city} onChangeText={setCity} />

      <Button title="add worksite" onPress={() => newWorksite({ address, city })} />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default AddNewWorksite;
