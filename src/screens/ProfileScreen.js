import {Text, View, StyleSheet } from "react-native";


const ProfileScreen = () => {
    return (
        <View>
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