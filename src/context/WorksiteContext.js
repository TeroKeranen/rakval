import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import rakval from "../api/rakval";
import { navigate, resetAndNavigate } from "../navigationRef";
import { useTranslation } from "react-i18next";
import {TOKEN_REPLACE} from '@env'




const worksiteReducer = (state, action) => {
    switch (action.type) {
      case 'clear_error_message':
        return {...state, errorMessage: ''};

      case "add_worksite":
        return { ...state, worksites: [...state.worksites, action.payload] };
      case 'add_worksite_floorplan':
        return {
          ...state,
          worksites: state.worksites.map(worksite => 
            worksite._id === action.payload.worksiteId 
              ? { ...worksite, floorplanKey: action.payload.floorplanKey } 
              : worksite
          )
        };
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
        case 'add_markers':
          const existingMarkerIds = new Set(state.currentWorksite.markers.map(marker => marker._id));
  const newMarkers = action.payload.markers.filter(marker => !existingMarkerIds.has(marker._id));

  return {
    ...state,
    currentWorksite: {
      ...state.currentWorksite,
      markers: [...state.currentWorksite.markers, ...newMarkers]
    }
  };
        //   return {
        //     ...state,
        //     currentWorksite: {
        //       ...state.currentWorksite,
        //       markers: [...state.currentWorksite.markers, ...action.payload.markers] // Oletetaan että action.payload sisältää uudet markerit
        // }}
        case 'update_marker':
          const updatedCurrentWorksite = {
            ...state.currentWorksite,
            markers: state.currentWorksite.markers.map(marker => 
              marker._id === action.payload.markerId ? action.payload.updateMarker : marker
              )
          }
          return {...state, currentWorksite: updatedCurrentWorksite}
      case 'delete_marker':
        return { ...state, currentWorksite: { ...state.currentWorksite, markers: state.currentWorksite.markers.filter((marker) => marker._id !== action.payload.markerId) } };
      case 'start_work_day': 
          // return {...state, currentWorksite: {...state.currentWorksite, workDays: [...state.currentWorksite.workDays, action.payload]}}
          const newWorkDay = action.payload;
          return {
            ...state,
            currentWorksite: {
              ...state.currentWorksite,
              workDays: [...state.currentWorksite.workDays, newWorkDay]
            }
          }
          

      case 'end_work_day':
        const updateWorkDays = state.currentWorksite.workDays.map(day => 
            day._id === action.payload._id ? action.payload: day
          )
          return {
            ...state, currentWorksite: {...state.currentWorksite, workDays: updateWorkDays}
          }
      case 'add_calendar_entry':
        return {...state, currentWorksite: {...state.currentWorksite, calendarEntries: [...state.currentWorksite.calendarEntries, action.payload]}}
      case 'set_calendar_entries':
        return {...state, currentWorksite: {...state.currentWorksite, calendarEntries: action.payload }}
      case 'update_calendar_entry':

        const updatedCalendarEntries = state.currentWorksite.calendarEntries.map(entry => 
          entry._id === action.payload._id ? action.payload : entry
        );
        return {
          ...state,
          currentWorksite: {
            ...state.currentWorksite,
            calendarEntries: updatedCalendarEntries
          }
        };
      case 'delete_calendar_entry':
        const updatedCalendarEntriess = state.currentWorksite.calendarEntries.filter(
          entry => entry._id !== action.payload.entryId
        )
        return {
          ...state,
          currentWorksite: {
            ...state.currentWorksite,
            calendarEntries:updatedCalendarEntriess
          }
        }
      default:
        return state;
    }
}
// Käytetään puhdistamaan error message
const clearErrorMessage = dispatch => () => {
  dispatch({type: 'clear_error_message'})
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

// työmään poistaminen
const deleteWorksite = (dispatch) => {
    return async (worksiteId, callback) => {
      
    try {
      const token = await AsyncStorage.getItem('token');
      const authHeader = `${TOKEN_REPLACE} ${token}`;
      
      await rakval.delete(`/worksites/${worksiteId}`, {
        headers: {
          Authorization: authHeader
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

// etsitään työmaan tiedot id perusteella
const fetchWorksiteDetails = (dispatch) => async (worksiteId) => {
  
  try {
    const token = await AsyncStorage.getItem("token");
    const authHeader = `${TOKEN_REPLACE} ${token}`;
    if (token) {
      const response = await rakval.get(`/worksites/${worksiteId}`, {
        headers: {
          Authorization: authHeader,
        },
      });
      
      dispatch({ type: "set_current_worksite", payload: response.data });
    }
    
  } catch (error) {
    dispatch({ type: "set_error", payload: "työmään tietojen haku epäonnistui" });
    console.log(error);
      }
}

// Käytetään tätä hakemaan työmaat Worksite.js sivustolle
const fetchWorksites = (dispatch) => {
  
    return async () => {
    try {
      
      const token = await AsyncStorage.getItem("token");
      const authHeader = `${TOKEN_REPLACE} ${token}`;
      const userJson = await AsyncStorage.getItem('user');
      
      const user = JSON.parse(userJson);
      
      
      
      const response = await rakval.get("/worksites", {
        headers: {
          Authorization: authHeader,
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


  // Lisätään työntekijä työmaalle
  const addWorkerToWorksite = (dispatch) => async (worksiteId,workerId) => {
        
    try {
      
      const token = await AsyncStorage.getItem("token");
      const authHeader = `${TOKEN_REPLACE} ${token}`;
      const response = await rakval.post(`/worksites/${worksiteId}/add-worker`,{ workerId },
            {
              headers: {
                Authorization: authHeader,
                  },
            }
        );
        
      dispatch({ type: "update_worksite", payload: response.data });
                  
  } catch (error) {
    
  }
}

// Poistetaan työntekijä työmaasta
const deleteWorkerFromWorksite = (dispatch) => {
    return async (worksiteId, workerId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const authHeader = `${TOKEN_REPLACE} ${token}`;
      await rakval.delete(`/worksites/${worksiteId}/workers/${workerId}`, {
        headers: { Authorization: authHeader },
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
  
    
    const { t } = useTranslation();
    return async ({address, city, floorplanKey,worktype, navigation }) => {
        try {
            const token = await AsyncStorage.getItem('token')
            const authHeader = `${TOKEN_REPLACE} ${token}`;
            const response = await rakval.post('/worksites', {address, city, floorplanKey,worktype}, {
                headers: {
                    Authorization: authHeader,
                    
                    
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

// käytetää kun lähetetään kuva databaseen
const floorplankeySend = (dispatch) => async (worksiteId, floorplan) => {
  try {
    
    const token = await AsyncStorage.getItem('token')
    const authHeader = `${TOKEN_REPLACE} ${token}`;

    const response = await rakval.post(`/worksites/${worksiteId}/floorplan`, floorplan, {
      headers: {
        Authorization: authHeader
      }
    })
    dispatch({type: 'add_worksite_floorplan', payload:{worksiteId, floorplanKey: response.data.floorplanKey}})
  } catch (error) {
    
  }
}


const saveMarkerToDatabase = (dispatch) => async (worksiteId, markerData) => {
  
    try {
    
    const token = await AsyncStorage.getItem("token");
    const authHeader = `${TOKEN_REPLACE} ${token}`;
  
    const response = await rakval.post(`/worksites/${worksiteId}/add-marker`, markerData, {
      headers: {
        
        Authorization: authHeader
          }
        })
          
          dispatch({ type: "add_markers", payload: response.data });
  } catch (error) {
    console.log("SavemarkerTodatabaseERROR",error);
    
  }
}


// markerin muokkaus
const updateMarker = (dispatch) => async (worksiteId, markerId, updatedMarkerData, t) => {
    
    try {
    const token = await AsyncStorage.getItem('token');
    const authHeader = `${TOKEN_REPLACE} ${token}`;
    const response = await rakval.put(`/worksites/${worksiteId}/markers/${markerId}`, updatedMarkerData, {
      headers: {Authorization: authHeader}
    })
    dispatch({type: 'update_marker', payload: {markerId, updateMarker: response.data}})
  } catch (error) {
    dispatch({type: 'set_error', payload: 'jotai meni vikaan'})
    console.log(error)
  }
}

const deleteMarker = (dispatch) => async (worksiteId, markerId,markerNumber) => {
  
  try {
    const token = await AsyncStorage.getItem('token');
    const authHeader = `${TOKEN_REPLACE} ${token}`;
    const queryString = `markerNumber=${markerNumber}`;
    await rakval.delete(`/worksites/${worksiteId}/remove-marker/${markerId}?${queryString}`, {
      headers: {
        Authorization: authHeader
      }
    })
    dispatch({type: "delete_marker", payload: {markerId}})
  } catch (error) {
    console.log("deletemarkerERROR",error);
  }
}

const startWorkDay = (dispatch) => async (worksiteId,userId) => {
   
  try {
    const token = await AsyncStorage.getItem('token');
    const authHeader = `${TOKEN_REPLACE} ${token}`;
    const response = await rakval.post(`/worksites/${worksiteId}/startday`,{userId}, {
      headers: {
        Authorization: authHeader
      }
    })
    
    dispatch({ type: 'start_work_day', payload: response.data });
  } catch (error) {
    console.log(error);
  }
}
const endWorkDay = (dispatch) => async (worksiteId, workDayId) => {
    try {
    const token = await AsyncStorage.getItem('token');
    const authHeader = `${TOKEN_REPLACE} ${token}`;
    const response = await rakval.post(`/worksites/${worksiteId}/endday`, { workDayId }, {
      headers: { Authorization: authHeader }
    });

    dispatch({ type: 'end_work_day', payload: response.data });
  } catch (error) {
    console.log(error);
    // Virheenkäsittely
  }
};

const saveCalendarEntry = (dispatch) => async (worksiteId, date,title,text) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const authHeader = `${TOKEN_REPLACE} ${token}`;
    const response = await rakval.post(`/worksites/${worksiteId}/calendar-entry`, {date, title, text}, {
      headers: {
        Authorization: authHeader
      }
    })
    dispatch({type:'add_calendar_entry', payload: response.data})
  } catch (error) {
    
  }
}

const fetchCalendarEntries = (dispatch) => async (worksiteId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const authHeader = `${TOKEN_REPLACE} ${token}`;
    const response = await rakval.get(`/worksites/${worksiteId}/calendar-entries`, {
      headers: {
        Authorization: authHeader
      }
    })
    
      dispatch({ type: 'set_calendar_entries', payload: response.data });
    
  } catch (error) {
    console.log("Virher kalenterimerkintöjen haussa", error);
  }
}

const updateCalendarEntry = (dispatch) => async (worksiteId, entryId, date,title,text) => {

  try {
    const token = await AsyncStorage.getItem('token');
    const authHeader = `${TOKEN_REPLACE} ${token}`;
    const response = await rakval.put(`/worksites/${worksiteId}/calendar-entry/${entryId}`, {date, title, text},{
      headers:{
        Authorization: authHeader
      }
    })
    dispatch({type: 'update_calendar_entry', payload: {_id: entryId, date, title, text}})
  } catch (error) {
    console.error("Virhe päivitettäessä kalenterimerkintää:", error);
  }

}

const deleteCalendarEntry = (dispatch) => async (worksiteId, entryId,date) => {
  
  try {
    const token = await AsyncStorage.getItem('token');
    const authHeader = `${TOKEN_REPLACE} ${token}`;
    const url = `/worksites/${worksiteId}/calendar-entry/${entryId}?date=${encodeURIComponent(date)}`;
    await rakval.delete(url, {
      headers: {
        Authorization: authHeader
      }
    })
    dispatch({type: 'delete_calendar_entry', payload: {entryId}})
  } catch (error) {
    console.error("Virhe poistettaessa kalenterimerkintää:", error);
  }

}


export const { Provider, Context } = createDataContext(worksiteReducer, {
   newWorksite,
    fetchWorksites,
     clearWorksites,
      fetchWorksiteDetails,
       resetCurrentWorksite,
        deleteWorksite,
         addWorkerToWorksite,
          deleteWorkerFromWorksite,
           saveMarkerToDatabase,
            deleteMarker,
             updateMarker,
             startWorkDay,
             endWorkDay,
             saveCalendarEntry,
             fetchCalendarEntries,
             updateCalendarEntry,
             deleteCalendarEntry,
             floorplankeySend
             },
              { worksites: [], errorMessage: "", currentWorksite: [] });