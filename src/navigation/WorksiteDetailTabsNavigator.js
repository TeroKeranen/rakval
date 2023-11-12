import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { Context as AuthContext } from "../context/AuthContext";

// Screens
import WorksiteDetails from "../screens/workisiteScreens/WorksiteDetails";
import WorksiteWorkers from "../screens/workisiteScreens/WorksiteWorkers";
import { useContext, useEffect } from "react";

const Tab = createBottomTabNavigator();

const WorksiteDetailsTabsNavigator = ({route}) => {

    const { t } = useTranslation();

    const {state, fetchUser} = useContext(AuthContext)

    const isAdmin = state.user.role === 'admin';

    
    
    
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Tab.Screen name ={t('worksiteDetail')} component={WorksiteDetails} initialParams={{worksiteId: route.params.worksiteId}}/>
            {isAdmin ? <Tab.Screen name={t('workers')} component={WorksiteWorkers} /> : null}
            
        </Tab.Navigator>
    )




};

export default WorksiteDetailsTabsNavigator;
