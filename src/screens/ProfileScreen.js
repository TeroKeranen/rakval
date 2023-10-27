import {Text, View, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context/AuthContext";



const ProfileScreen = () => {

    const { state, fetchUser } = useContext(AuthContext); 
    const [email, setEmail] = useState('');
    
    
    useEffect(()=> {
        fetchUser();
        
    },[])

    useEffect(() => {
      if (state.user) {
        setEmail(state.user.email);
      }
    }, [state]);


    return (
        <View>
            <Text>{email}</Text>
            <Text style={styles.text}>ProfileScreen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: 'black',
    }
})

export default ProfileScreen;