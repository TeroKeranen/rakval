import { useContext } from "react";
import { FlatList, Text, View } from "react-native";



const WorksiteReady = ({worksites, title}) => {

    

    // console.log("worksiteready",worksiteState.worksites)
    console.log(worksites)

    

    

    return (
        <View>
          <Text>{title}</Text>
          <FlatList
            data={worksites}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Text>{item.address}</Text>}
          />
        </View>
      );
    

}


export default WorksiteReady;