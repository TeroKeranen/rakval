import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


const Accordion = ({title, handlePress}) => {
    

    

    return (
        <View style={styles.titleContainer}>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
          </View>
    )
}



const styles = StyleSheet.create({
  button: {
    backgroundColor: "#507ab8",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    // width: "50%",
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: 'white',
    
  }
});

export default Accordion;