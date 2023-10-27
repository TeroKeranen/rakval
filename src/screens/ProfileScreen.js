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
    // const [email, setEmail] = useState('');


    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         try {
    //             const response = await axios.get("https://c39a-91-152-126-92.ngrok-free.app/profile",{
    //                 headers: {Authorization: `Bearer ${state.token}`}
    //             } );
    //             if (response.data.email) {
    //                 setEmail(response.data.email);
    //             }
    //         } catch (error) {
    //             console.log("there was error fetching the profile data");
    //         }
    //     }
    //     fetchProfile();
    // }, [])

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