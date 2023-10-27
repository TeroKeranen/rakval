import { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import {Text, Input, Button } from 'react-native-elements'
import {Context as AuthContext} from '../context/AuthContext'

const SignupScreen = ({navigation}) => {

  const { state, signup} = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 
     return (
       <>
         <View style={styles.container}>
           <Text h3 style={styles.text}>Sign up</Text>
           <Input 
            label="Email" 
            value={email} 
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            />
           <Input 
            secureTextEntry
            label="Password" 
            value={password} 
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}     
            />
            {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
           <Button title="Sign Up" onPress={() => signup({email, password})} />

           <TouchableOpacity onPress={() => navigation.navigate('signin')}>
            <Text style={styles.link}>Already have an account? sign in instead</Text>
            </TouchableOpacity>

         </View>
       </>
     );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
    marginBottom: 250,
    
  },
  text: {
    alignSelf: 'center',
    marginBottom: 50,
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
  },
  link: {
    color: 'blue',
    margin: 20,
  }

})



export default SignupScreen;
