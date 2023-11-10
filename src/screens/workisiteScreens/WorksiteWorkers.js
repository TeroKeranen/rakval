import { useContext } from "react";
import { Text, View } from "react-native";
import {Context as WorksiteContext} from '../../context/WorksiteContext';


const WorksiteWorkers = () => {
    const { state, fetchWorksiteDetails, fetchWorksites, resetCurrentWorksite, deleteWorksite } = useContext(WorksiteContext);

    console.log("WOOOORKEEERRS", state.currentWorksite);
    return (
        <View>
            <Text>
                työntekijöitten lisäys
            </Text>
        </View>
    )

}


export default WorksiteWorkers;