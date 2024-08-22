
import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import {Context as WorksiteContext} from '../../context/WorksiteContext'
import {Context as AuthContext} from '../../context/AuthContext'
import { useContext, useState } from "react";
import WorksiteForm from "../../components/WorksiteForm";



const AddNewWorksite = ({navigation}) => {


  
  const {state, newWorksite, clearErrorMessage} = useContext(WorksiteContext);
  const {state: authState} = useContext(AuthContext);
  const currentWorksitesCount = state.worksites.length;
  const userRole = authState?.user?.role;

  
  
  return (
    <View style={styles.container}>
      {/* <WorksiteForm errorMessage={state.errorMessage} clearError={() => clearErrorMessage()} onSubmit={(data) => newWorksite({...data, navigation})}/> */}
      <WorksiteForm errorMessage={state.errorMessage} onSubmit={(data) => newWorksite({...data, navigation})} currentWorksitesCount={currentWorksitesCount}  userRole={userRole}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    
    
  },
  
  
});

export default AddNewWorksite;
