import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

// Screens
import WorksiteDetails from "../screens/workisiteScreens/WorksiteDetails";
import WorksiteWorkers from "../screens/workisiteScreens/WorksiteWorkers";

const Tab = createBottomTabNavigator();

const WorksiteDetailsTabsNavigator = ({route}) => {
    
    
    return (
        <Tab.Navigator>
            <Tab.Screen name ="Details" component={WorksiteDetails} initialParams={{worksiteId: route.params.worksiteId}}/>
            <Tab.Screen name="Workers" component={WorksiteWorkers} />
        </Tab.Navigator>
    )




};

export default WorksiteDetailsTabsNavigator;
