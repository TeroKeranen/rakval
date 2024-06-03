// import { useState } from "react";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


// const Accordion = ({title, handlePress, isSelected}) => {
    
//    const buttonStyle = isSelected ? styles.selectedButton : styles.button;
    

//     return (
//         <View style={styles.titleContainer}>
//             <TouchableOpacity style={buttonStyle} onPress={handlePress}>
//                 <Text style={styles.text}>{title}</Text>
//             </TouchableOpacity>
//           </View>
//     )
// }



// const styles = StyleSheet.create({
//   titleContainer: {
    
//   },
//   button: {
//     backgroundColor: "#74777c",
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 10,
//     // width: "50%",
//     alignItems: "center",
//     alignSelf: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
    
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   selectedButton: {
//     backgroundColor: "#507ab8", // Väri kun nappi on valittu
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 10,
//     alignItems: "center",
//     alignSelf: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   text: {
//     color: 'white',
    
//   }
// });

// export default Accordion;