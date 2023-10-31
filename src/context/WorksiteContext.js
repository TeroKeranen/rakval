import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import rakval from "../api/rakval";
import { navigate, resetAndNavigate } from "../navigationRef";


const worksiteReducer = (state, action) => {
    switch (action.type) {
        case 'add_worksite':
            return {...state, worksites: [...state.worksites, action.payload]}
        case 'set_error':
            return {...state, errorMessage: action.payload}
        default:
            return state;
    }
}

// lähetetään uusityömaa tietokantaan
const newWorksite = (dispatch) => {
    return async ({address, city }) => {
        try {
            const token = await AsyncStorage.getItem('token')
            const response = await rakval.post('/worksites', {address, city}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data.token);
            dispatch({type: 'add-worksite', payload:response.data})
            console.log("lisötty worksite")
            
        } catch (error) {
            dispatch({type: 'set_error', payload: 'jotai meni vikaan'})
            console.log(error)
            
        }
    }
}


export const {Provider, Context} = createDataContext(worksiteReducer, {newWorksite}, {worksites:[], errorMessage: ""})