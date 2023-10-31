import { Text, View, StyleSheet } from "react-native";
import {useContext, useEffect} from 'react';
import { Context as Autcontext} from '../context/AuthContext'
import {Button} from 'react-native-elements'

const Etusivu = () => {
  const { state, fetchUser } = useContext(Autcontext);

  // Haetaan AuthCOntect.js avulla tiedot käyttäjästä.
  useEffect(() => {
    fetchUser();
    

  },[])

  
  return (
    <View>
      <Text style={styles.text}>Etusivu</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
});

export default Etusivu;
