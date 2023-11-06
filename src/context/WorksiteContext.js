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
      case 'set_current_worksite':
        return {...state, currentWorksite: action.payload}
      case "set_error":
        return { ...state, errorMessage: action.payload };
      case "clear_worksites":
        return { ...state, worksites: [] };
      case 'reset_current_worksite':
        return {...state, currentWorksite:null}
      default:
        return state;
    }
}

const clearWorksites = (dispatch) => {
  return () => {
    dispatch({type:'clear_worksites'})
  }
}

// Käytetään WorksiteDetails.js sivustolla tyhjentämään edellisen työmaantiedot näkyvistä
const resetCurrentWorksite = (dispatch) => {
  return () => {
    dispatch({ type: "reset_current_worksite" });

  }
}


// Kun työmaalistasta painetaan työmaata niin tällä saadaan avattua tietyn työmaan
const fetchWorksiteDetails = (dispatch) => {
  return async (worksiteId) => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const response = await rakval.get(`/worksites/${worksiteId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        dispatch({type: 'set_current_worksite', payload: response.data})
      }
      
    } catch (error) {
      dispatch({type: 'set_error', payload: 'työmään tietojen haku epäonnistui'})
      console.log(error);
      
    }
  }
}

// Käytetään tätä hakemaan työmaat Worksite.js sivustolle
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
            
            
            dispatch({type: 'add_worksite', payload:response.data})
            navigation.navigate("Työmaat");
            
            
        } catch (error) {
            dispatch({type: 'set_error', payload: 'jotai meni vikaan'})
            console.log(error)
            
        }
    }
}


export const { Provider, Context } = createDataContext(worksiteReducer, { newWorksite, fetchWorksites, clearWorksites, fetchWorksiteDetails, resetCurrentWorksite }, { worksites: [], errorMessage: "", currentWorksite: [] });