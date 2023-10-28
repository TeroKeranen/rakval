import { Text, View, StyleSheet } from "react-native";
import {useContext} from 'react';
import { Context as Autcontext} from '../context/AuthContext'
import {Button} from 'react-native-elements'

const TestiScreen = () => {

  const {signout} = useContext(Autcontext);
  return (
    <View>
      <Text style={styles.text}>TestisCRENEN</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
});

export default TestiScreen;
