import {Text, View, StyleSheet} from "react-native";
import { Button } from "react-native-elements";
import { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context/AuthContext";




const ProfileScreen = () => {

    const { state, fetchUser, signout } = useContext(AuthContext); 
    const [email, setEmail] = useState('');
    const [testi, setTesti] = useState('');
    
    
    useEffect(()=> {
        fetchUser();
        
    },[])

    useEffect(() => {
      if (state.user) {
        setEmail(state.user.email);
        setTesti(state.user.role)
      }
    }, [state]);


    return (
      <View>
        <Text>
          {email} ja {testi}
        </Text>
        <Text style={styles.text}>ProfileScreen</Text>
       
        <Button title="Sign out" onPress={signout} />
      </View>
    );
}

const styles = StyleSheet.create({
    text: {
        color: 'black',
    }
})

export default ProfileScreen;