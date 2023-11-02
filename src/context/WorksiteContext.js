import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import rakval from "../api/rakval";
import { navigate, resetAndNavigate } from "../navigationRef";


const worksiteReducer = (state, action) => {
    switch (action.type) {
      case "add_worksite":
        return { ...state, worksites: [...state.worksites, action.payload] };
      case "fetch_worksites":
        return { ...state, worksites: action.payload };
      case "set_error":
        return { ...state, errorMessage: action.payload };
      case "clear_worksites":
        return { ...state, worksites: [] };
      default:
        return state;
    }
}

const clearWorksites = (dispatch) => {
  return () => {
    dispatch({type:'clear_worksites'})
  }
}

const fetchWorksites = (dispatch) => {
  return async () => {
    try {
      
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem('user');
      
      const user = JSON.parse(userJson);
      

      
      const response = await rakval.get("/worksites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      

      
      dispatch({ type: "fetch_worksites", payload: response.data });

    } catch (error) {

      if (error.response && error.response.status === 400 && error.response.data.error === "Käyttäjällä ei ole yritystä2") {
        console.log("Käyttäjällä ei ole yritystä, ei haeta työmaita.");
      } else {

        dispatch({type: 'set_error', payload: "jotain meni vikaan (työmaitten hauan kanssa)"})
      }
      console.log(error);
    }
  };
};

// lähetetään uusityömaa tietokantaan
const newWorksite = (dispatch) => {
    return async ({address, city, navigation }) => {
        try {
            const token = await AsyncStorage.getItem('token')
            const response = await rakval.post('/worksites', {address, city}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("vastaus työmaalta", response.data);
            
            dispatch({type: 'add_worksite', payload:response.data})
            navigation.navigate("Työmaat");
            
            
        } catch (error) {
            dispatch({type: 'set_error', payload: 'jotai meni vikaan'})
            console.log(error)
            
        }
    }
}


export const {Provider, Context} = createDataContext(worksiteReducer, {newWorksite,fetchWorksites, clearWorksites}, {worksites:[], errorMessage: ""})