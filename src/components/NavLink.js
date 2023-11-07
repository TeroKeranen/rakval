/*
NavLink komponenttia käytetään signup ja signin sivuilla siirtymään toiselle sivulle
*/

import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NavLink = ({text, routeName}) => {

    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.navigate(routeName)}>
            <Text style={styles.link}>{text}</Text>
          </TouchableOpacity>
    )

}


const styles = StyleSheet.create({
  link: {
    color: "blue",
    margin: 20,
  },
});


export default NavLink;
