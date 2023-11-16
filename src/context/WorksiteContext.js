import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import rakval from "../api/rakval";
import { navigate, resetAndNavigate } from "../navigationRef";
import { useTranslation } from "react-i18next";


const worksiteReducer = (state, action) => {
    switch (action.type) {
      case "add_worksite":
        return { ...state, worksites: [...state.worksites, action.payload] };
      case "fetch_worksites":
        return { ...state, worksites: action.payload };
      case "set_current_worksite":
        return { ...state, currentWorksite: action.payload };
      case "set_error":
        return { ...state, errorMessage: action.payload };
      case "clear_worksites":
        console.log("suoritetaan clear_worksites");
        return { ...state, worksites: [] };
      case "reset_current_worksite":
        console.log("suoritetaan reset_current_worksite");
        return { ...state, currentWorksite: [] };
      case "delete_worksite":
        return { ...state, worksites: state.worksites.filter((worksite) => worksite._id !== action.payload) };
      case "delete_worker_from_worksite":
        return {
          ...state,
          currentWorksite: {
            ...state.currentWorksite,
            workers: state.currentWorksite.workers.filter((id) => id !== action.payload.workerId),
          },
        };
      case "update_worksite":
        const updatedWorksites = state.worksites.map((worksite) => (worksite._id === action.payload._id ? action.payload : worksite));
        return { ...state, worksites: updatedWorksites, currentWorksite: action.payload };
      case 'update_markers':
        return {
          ...state,
          currentWorksite: {
            ...state.currentWorksite,
            markers: [...state.currentWorksite.markers, ...action.payload.markers] // Oletetaan että action.payload sisältää uudet markerit
        }}
        
      default:
        return state;
    }
}

const clearWorksites = (dispatch) => {
  console.log("joko");
  return () => {

    dispatch({type:'clear_worksites'})
  }
}

// Käytetään WorksiteDetails.js sivustolla tyhjentämään edellisen työmaantiedot näkyvistä
const resetCurrentWorksite = (dispatch) => {
  return () => {
    console.log("resecurrentworksite");
    dispatch({ type: "reset_current_worksite" });
    
  }
}

const deleteWorksite = (dispatch) => {
  return async (worksiteId, callback) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await rakval.delete(`/worksites/${worksiteId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (callback) {
        callback();
      }
      
      dispatch({type:"delete_worksite", payload: worksiteId})
    } catch (error) {
      console.log(error)
      dispatch({type:'set_error', payload: 'työmaan poisto epäonnistui'})
      
    }
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
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            // Käyttäjällä ei ole yritystä, ei tarvitse asettaa virheviestiä, voitaisiin ohjata luomaan yritys tai liittymään yritykseen
            console.log("Käyttäjällä ei ole yritystä, ei haeta työmaita.");
            break;
            // Lisää muita koodin käsittelyjä tarvittaessa
            default:
            dispatch({ type: "set_error", payload: "jotain meni vikaan (työmaitten hauan kanssa)" });
        }
      } else {
        // Jos virhe ei ole HTTP-virhe, käsittele se yleisenä virheenä
        dispatch({ type: "set_error", payload: "Yleinen virhe työmaita haettaessa" });
      }
      console.log(error);
      
      // if (error.response && error.response.status === 400 && error.response.data.error === "Käyttäjällä ei ole yritystä2") {
        //   console.log("Käyttäjällä ei ole yritystä, ei haeta työmaita.");
        // } else {
          
          //   dispatch({type: 'set_error', payload: "jotain meni vikaan (työmaitten hauan kanssa)"})
          // }
          // console.log(error);
        }
      };
};

// const addWorkerToWorksite = (dispatch) => {
  
  //   return async (worksiteId, workerId) => {
    //     try {
      //       const token = await AsyncStorage.getItem('token');
      //       const response = await rakval.post(`/worksites/${worksiteId}/add-worker`, {workerId}, {
        //         headers: {
          //           Authorization: `Bearer ${token}`
          //         }
          //       })
          //       dispatch({type: 'update_worksite', payload:response.data})
          //     } catch (error) {
            
            //     }
            //   }
            // }
            
            const addWorkerToWorksite = (dispatch) => async (worksiteId,workerId) => {
              try {
                const token = await AsyncStorage.getItem("token");
                const response = await rakval.post(
                  
                  `/worksites/${worksiteId}/add-worker`,
                  { workerId },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                  );
                  dispatch({ type: "update_worksite", payload: response.data });
                  
  } catch (error) {
    
  }
}

const deleteWorkerFromWorksite = (dispatch) => {
  return async (worksiteId, workerId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await rakval.delete(`/worksites/${worksiteId}/workers/${workerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Päivitä worksiteState sen jälkeen kun työntekijä on poistettu
      dispatch({ type: "delete_worker_from_worksite", payload: { worksiteId, workerId } });
    } catch (error) {
      // Käsittely virheille
    }
  };
};
// lähetetään uusityömaa tietokantaan
const newWorksite = (dispatch) => {
    console.log("viddu");
    const { t } = useTranslation();
    return async ({address, city, floorplanKey, navigation }) => {
        try {
            const token = await AsyncStorage.getItem('token')
            const response = await rakval.post('/worksites', {address, city, floorplanKey}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            
            dispatch({type: 'add_worksite', payload:response.data})
            navigation.navigate(t("construction-site"));
            
            
        } catch (error) {
            dispatch({type: 'set_error', payload: 'jotai meni vikaan'})
            console.log(error)
            
        }
    }
}

// lähetetään uusityömaa tietokantaan
// const newWorksite = (dispatch) => async ({address,city,floorplanKey, navigation}) => {
  
//   try {
//     const { t } = useTranslation();
//     const token = await AsyncStorage.getItem("token");
//     const response = await rakval.post('/worksites', {address, city, floorplanKey}, {

//         headers: {

//           Authorization: `Bearer ${token}`
//         }
//         })
            
            
//             dispatch({type: 'add_worksite', payload:response.data})
//             navigation.navigate(t("construction-site"));

//   } catch (error) {
//     dispatch({ type: "set_error", payload: "jotai meni vikaan" });
//     console.log(error);
    
//   }
// }

// lähetetään merkkit tietokantaan
// const saveMarkerToDatabase = (dispatch) => {
//       console.log("jsjsj");

//   return async (worksiteId, markerData) => {
      
    
//     try {
//       const token = await AsyncStorage.getItem('token');
      
      
//       const response = await rakval.post(`/worksites/${worksiteId}/add-marker`, markerData, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       })
      
      
//       dispatch({type: "update_markers", payload: response.data})
//     } catch (error) {
//       console.log(error); 
//     }
//   }
// }
const saveMarkerToDatabase = (dispatch) => async (worksiteId, markerData) => {
  
  try {
    const token = await AsyncStorage.getItem("token");
          const response = await rakval.post(`/worksites/${worksiteId}/add-marker`, markerData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          console.log("done")
          dispatch({ type: "update_markers", payload: response.data });
  } catch (error) {
    console.log(error);
    
  }
}


export const { Provider, Context } = createDataContext(worksiteReducer, { newWorksite, fetchWorksites, clearWorksites, fetchWorksiteDetails, resetCurrentWorksite, deleteWorksite, addWorkerToWorksite, deleteWorkerFromWorksite, saveMarkerToDatabase }, { worksites: [], errorMessage: "", currentWorksite: [] });