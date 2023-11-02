
import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import {Context as WorksiteContext} from '../../context/WorksiteContext'
import { useContext, useState } from "react";
import WorksiteForm from "../../components/WorksiteForm";


const AddNewWorksite = ({navigation}) => {

  const {state, newWorksite} = useContext(WorksiteContext);
  
  return (
    <View style={styles.container}>
      <WorksiteForm errorMessage={state.errorMessage} onSubmit={(data) => newWorksite({...data, navigation})}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    borderWidth: 1,
    borderColor: 'red',
  },
  
  
});

export default AddNewWorksite;
