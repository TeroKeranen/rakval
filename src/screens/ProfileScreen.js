import {Text, View, StyleSheet, Alert, TextInput} from "react-native";
import { Button } from "react-native-elements";
import { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import {Context as WorksiteContext} from '../context/WorksiteContext'
import {Context as CompanyContext} from '../context/CompanyContext'


//RU52jfh7aF

const ProfileScreen = ({navigation}) => {

    const { state,fetchUser, signout, joinCompany } = useContext(AuthContext); 
    const { clearCompany } = useContext(CompanyContext);
    const {clearWorksites, fetchWorksites} = useContext(WorksiteContext);
    const [email, setEmail] = useState('');
    const [testi, setTesti] = useState('');
    const [companyCode, setCompanyCode] = useState('');
    
    
    useEffect(()=> {
      const unsubscribe = navigation.addListener('focus', () => {
          fetchUser();
          console.log("fokuuus");
          console.log("profilescreen", state);
        })

        return unsubscribe
        
    },[navigation])
    
    useEffect(() => {
      if (state.user) {
        setEmail(state.user.email);
        setTesti(state.user.role)
        
      }
    }, [state]);
    

    // Käytetään tätä kun liitytään yritykseen
    const handleJoinCompany = async () => {
      
        await joinCompany(companyCode)
        fetchUser();
        fetchWorksites();
      
    }

    // käytetään tätä uloskirjautumiseen
    const handleSignout = async () => {

      await clearWorksites(); // pyyhitään työmaatiedot statesta
      await clearCompany(); // pyyhitään company tiedot statesta
      signout();
    }

    return (
      <View>
        <Text>
          {email} ja {testi}
        </Text>
        <Text style={styles.text}>ProfileScreen</Text>

        {/* admin käyttäjä */}
        {state.user.role === "admin" ? (
          <Text>Olet admin käyttäjä</Text>
        ) : (
          // normi käyttäjä
          <>
            {state.user.company ? (
              <Text>Olet liittynyt yritykseen {state.user.company.name}</Text>
            ) : (
              // jos käyttäjä ei ole liittynyt yritykseen
              <>
                <TextInput placeholder="Enter company code" value={companyCode} onChangeText={setCompanyCode} style={styles.input} />
                <Button title="Lisää yritys" onPress={handleJoinCompany} />
              </>
            )}
          </>
        )}

        {/* {state.user.company  ? (
          <Text>Olet liittynyt yritykseen {state.user.company.name}</Text>
        ) : (
          <>
          
          <TextInput placeholder="Enter company code" value={companyCode} onChangeText={setCompanyCode} style={styles.input} />
          <Button title="Lisää yritys" onPress={handleJoinCompany} />
          </>
        )} */}

        <Button title="Sign out" onPress={handleSignout} />
      </View>
    );
}

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default ProfileScreen;