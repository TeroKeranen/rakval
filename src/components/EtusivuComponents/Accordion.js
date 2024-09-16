
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


const Accordion = ({title, handlePress, isSelected}) => {
    
   const buttonStyle = isSelected ? styles.selectedButton : styles.button;
    

    return (
        <View style={styles.titleContainer}>
            <TouchableOpacity style={buttonStyle} onPress={handlePress}>
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
          </View>
    )
}



const styles = StyleSheet.create({
  titleContainer: {
    
  },
  button: {
    padding:20,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: 15,
    marginHorizontal: 10,
    shadowColor: '#000000', // Varjon väri
    shadowOffset: { width: 0, height: 4 }, // Varjon offset (suunta)
    shadowOpacity: 1, // Varjon peittävyys
    shadowRadius: 4, // Varjon sumeus
    elevation: 5, // Android-varjo
    backgroundColor: '#333644', // Tausta lisättävä, jotta varjo näkyy kunnollas Androidilla)
    elevation: 5, // Vain Androidille
  },
  buttonStyle: {
    padding:20,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: 15,
    marginHorizontal: 10,
    shadowColor: '#000000', // Varjon väri
    shadowOffset: { width: 0, height: 4 }, // Varjon offset (suunta)
    shadowOpacity: 1, // Varjon peittävyys
    shadowRadius: 4, // Varjon sumeus
    elevation: 5, // Android-varjo
    backgroundColor: '#333644', // Tausta lisättävä, jotta varjo näkyy kunnollas Androidilla)
    elevation: 5, // Vain Androidille

  },
  selectedButton: {
    backgroundColor: "#507ab8", // Väri kun nappi on valittu
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: 'white',
    
  }
});

export default Accordion;