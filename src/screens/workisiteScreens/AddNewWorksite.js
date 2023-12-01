
import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import {Context as WorksiteContext} from '../../context/WorksiteContext'
import { useContext, useState } from "react";
import WorksiteForm from "../../components/WorksiteForm";



const AddNewWorksite = ({navigation}) => {
  
  const {state, newWorksite, clearErrorMessage} = useContext(WorksiteContext);
  
  return (
    <View style={styles.container}>
      {/* <WorksiteForm errorMessage={state.errorMessage} clearError={() => clearErrorMessage()} onSubmit={(data) => newWorksite({...data, navigation})}/> */}
      <WorksiteForm errorMessage={state.errorMessage} onSubmit={(data) => newWorksite({...data, navigation})}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    
    
  },
  
  
});

export default AddNewWorksite;
