import { Text, View, StyleSheet } from "react-native";
import {useContext, useEffect} from 'react';
import { Context as Autcontext} from '../context/AuthContext'
import {Button} from 'react-native-elements'
import { useTranslation } from "react-i18next";

const Etusivu = () => {
  const { t } = useTranslation();
  const { state, fetchUser } = useContext(Autcontext);

  // Haetaan AuthCOntect.js avulla tiedot käyttäjästä.
  useEffect(() => {
    fetchUser();
    // console.log("etusivu state", state)
    

  },[])

  
  return (
    <View>
      <Text style={styles.text}>{t('front-page')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
});

export default Etusivu;
