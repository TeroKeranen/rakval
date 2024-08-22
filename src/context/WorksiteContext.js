import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import rakval from "../api/rakval";
import { navigate, resetAndNavigate } from "../navigationRef";
import { useTranslation } from "react-i18next";
import {TOKEN_REPLACE} from '@env'
import * as SecureStore from 'expo-secure-store';
import { makeApiRequest, refreshAccessToken } from "../api/refreshToken";




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
        
        return { ...state, worksites: [], errorMessage: "" };
      case "reset_current_worksite":
        
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
          
          return { ...state, worksites: updatedWorksites, currentWorksite: action.payload.data };
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
      case 'delete_product':
        
        const updatedWorksiteProducts = state.currentWorksite.products.filter(
          product => product._id !== action.payload.productId
        )
      
        return {
          ...state,
          currentWorksite: {
            ...state.currentWorksite,
            products: updatedWorksiteProducts
          }
        }
      
        case 'update_product':
          const updatedProducts = state.currentWorksite.products.map(product => 
            product._id === action.payload.productId ? { ...product, _id: action.payload.productId, name: action.payload.productName, quantity: action.payload.quantity } : product
          );
          
          return {
            ...state,
            currentWorksite: {
              ...state.currentWorksite,
              products: updatedProducts
            }
          };
        

        case 'add_product':
          
          return {
            ...state,
            currentWorksite: action.payload.worksite
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
      

      const response = await makeApiRequest(`/worksites/${worksiteId}`, "delete", null, dispatch);


      if (response.success) {
        
        dispatch({type:"delete_worksite", payload: worksiteId})
        if (callback) {
          callback(true);
        }
        return {success:true}
      } else {
        if (callback) {
          callback(false);
        }
        return {success:false}
      }
      
      
      
    } catch (error) {
      // console.log(error)
      dispatch({type:'set_error', payload: 'työmaan poisto epäonnistui'})
      
    }
  }
}

// etsitään työmaan tiedot id perusteella
const fetchWorksiteDetails = (dispatch) => async (worksiteId) => {
  
  try {
    // const token = await AsyncStorage.getItem("token");
    // const token = await SecureStore.getItemAsync('token');
    // const authHeader = `${TOKEN_REPLACE} ${token}`;
      const response = await makeApiRequest(`/worksites/${worksiteId}`, 'get', null, dispatch);
      // const response = await rakval.get(`/worksites/${worksiteId}`, {
      //   headers: {
      //     Authorization: authHeader,
      //   },
      // });
      
      dispatch({ type: "set_current_worksite", payload: response.data });
    
    
  } catch (error) {
    dispatch({ type: "set_error", payload: "työmään tietojen haku epäonnistui" });
    
      }
}

// Käytetään tätä hakemaan työmaat Worksite.js sivustolle
const fetchWorksites = (dispatch) => {
  
    return async () => {
    try {
      
      // const token = await AsyncStorage.getItem("token");
      // const token = await SecureStore.getItemAsync('token');
      // const authHeader = `${TOKEN_REPLACE} ${token}`;
      const userJson = await AsyncStorage.getItem('user');
      
      const user = JSON.parse(userJson);
      
      const response = await makeApiRequest('worksites', 'get', null, dispatch)
      
      if (response && response.data) {

        dispatch({ type: "fetch_worksites", payload: response.data });
      } else {
        
        dispatch({type:'set_error', payload: "No data"})
      }
      
      
    } catch (error) {
      
      // console.log("fetchworksitesError", error);
      
      
    
      }
    };
};


  // Lisätään työntekijä työmaalle
  const addWorkerToWorksite = (dispatch) => async (worksiteId, workerId) => {
    try {
        const response = await makeApiRequest(`/worksites/${worksiteId}/add-worker`, 'post', {workerId}, dispatch);
        

        if (response.success) {
            if (response.data) {
                if (response.data.alreadyAdded) {
                    return {success: true, alreadyAdded: true};
                } else {
                    dispatch({ type: "update_worksite", payload: response.data });
                    return {success: true, alreadyAdded: false};
                }
            } else {
                // Jos dataa ei ole, käsittele tilanne
                return {success: false, message: 'Ei vastaustietoja'};
            }
        } else {
            return {success: false, message: response.message || "Operation failed"};
        }
    } catch (error) {
        console.error("addWorkerToWorksite error:", error);
        return {success: false, message: 'Verkkovirhe'};
    }
};
// Poistetaan työntekijä työmaasta
const deleteWorkerFromWorksite = (dispatch) => {
    return async (worksiteId, workerId) => {
    try {
      // const token = await AsyncStorage.getItem("token");
      // const token = await SecureStore.getItemAsync('token');
      // const authHeader = `${TOKEN_REPLACE} ${token}`;
      const response = await makeApiRequest(`/worksites/${worksiteId}/workers/${workerId}`, 'delete', null, dispatch)
      // await rakval.delete(`/worksites/${worksiteId}/workers/${workerId}`, {
      //   headers: { Authorization: authHeader },
      // });
      // Päivitä worksiteState sen jälkeen kun työntekijä on poistettu
      
      dispatch({ type: "delete_worker_from_worksite", payload: { worksiteId, workerId } });
      return response.data
    } catch (error) {
      // Käsittely virheille
    }
  };
};

// lähetetään uusityömaa tietokantaan
const newWorksite = (dispatch) => {
  
    
    const { t } = useTranslation();
    return async ({address, city, startTime, floorplanKey,worktype, navigation }) => {

      
        try {
           

            const response = await makeApiRequest('/worksites', 'post', {address,city, startTime, floorplanKey, worktype}, dispatch)

        
            if (response.success) {
              dispatch({type: 'add_worksite', payload:response.data})
              navigation.navigate(t("construction-site"));
              return {success:true}

            } else {
              
              dispatch({type:'set_error', payload: response.message})
              return { success: false, message: response.message };
            }
            

            
            
        } catch (error) {

            // Varmistetaan, että virheellä on 'response' ja että 'response' sisältää 'status'
            if (error.response && error.response.status) {
              // console.log("HTTP status code:", error.response.status);
              if (error.response.status === 403) {
                return { success: false, message: error.response.data.error || "Access denied. You have reached the limit for creating worksites." };
              } else {
                // console.log("Error", "An unexpected error occurred.");
              }
          } else {
              // Jos 'response' ei ole määritelty, kyseessä voi olla verkkovirhe tai muu ongelma.
              console.log("Network error", "Unable to connect to the server. Please try again later.");
          }
          dispatch({ type: 'set_error', payload: 'Something went wrong' });
          // console.log("Network or server error:", error);
                        
        }
    }
}

// käytetää kun lähetetään kuva databaseen
const floorplankeySend = (dispatch) => async (worksiteId, floorplan) => {
  try {
    

    
    const response = await makeApiRequest(`worksites/${worksiteId}/floorplan`, 'post', floorplan, dispatch)

    
    if (response.success) {
      
      dispatch({type: 'add_worksite_floorplan', payload:{worksiteId, floorplanKey: response.data.floorplanKey}})
      return {success:true}

    } else {
      
      return {success:false}
    }
 
  } catch (error) {
    // console.log("floorplankeysend error", error);
    return {success:false}
  }
}

const getSignedUrl = (dispatch) => async (bucketName, objectKey) => {
  try {
    const response = await makeApiRequest(`get-signed-url?bucketName=${encodeURIComponent(bucketName)}&objectKey=${encodeURIComponent(objectKey)}`, 'get', null, dispatch)

    if (response.success) {
      
      return response.data;  // Olettaen että 'data' sisältää tarvittavan URL:n tai muun hyödyllisen tiedon
    } else {
      throw new Error(response.message || 'API request failed without a specific error');
    }
  } catch (error) {
    // console.log("GETSIGNURL error", error)
  }
}


const saveMarkerToDatabase = (dispatch) => async (worksiteId, markerData) => {
  
    try {
    
    // const token = await AsyncStorage.getItem("token");
    // const token = await SecureStore.getItemAsync('token');
    // const authHeader = `${TOKEN_REPLACE} ${token}`;
    const response = await makeApiRequest(`/worksites/${worksiteId}/add-marker`, 'post', markerData, dispatch);
    // const response = await rakval.post(`/worksites/${worksiteId}/add-marker`, markerData, {
    //   headers: {
        
    //     Authorization: authHeader
    //       }
    //     })
          
          dispatch({ type: "add_markers", payload: response.data });
  } catch (error) {
    // console.log("SavemarkerTodatabaseERROR",error);
    
  }
}


// markerin muokkaus
const updateMarker = (dispatch) => async (worksiteId, markerId, updatedMarkerData, t) => {
    
    try {
    // const token = await AsyncStorage.getItem('token');
    // const token = await SecureStore.getItemAsync('token');
    // const authHeader = `${TOKEN_REPLACE} ${token}`;
    const response = await makeApiRequest(`/worksites/${worksiteId}/markers/${markerId}`, 'put', updatedMarkerData, dispatch)
    // const response = await rakval.put(`/worksites/${worksiteId}/markers/${markerId}`, updatedMarkerData, {
    //   headers: {Authorization: authHeader}
    // })
    dispatch({type: 'update_marker', payload: {markerId, updateMarker: response.data}})
    return response
  } catch (error) {
    dispatch({type: 'set_error', payload: 'jotai meni vikaan'})
    // console.log(error)
  }
}

const deleteMarker = (dispatch) => async (worksiteId, markerId,markerNumber) => {
  
  try {
    // const token = await AsyncStorage.getItem('token');
    // const token = await SecureStore.getItemAsync('token');
    // const authHeader = `${TOKEN_REPLACE} ${token}`;

    const queryString = `markerNumber=${markerNumber}`;
    await makeApiRequest(`/worksites/${worksiteId}/remove-marker/${markerId}?${queryString}`, 'delete', null, dispatch);
    // await rakval.delete(`/worksites/${worksiteId}/remove-marker/${markerId}?${queryString}`, {
    //   headers: {
    //     Authorization: authHeader
    //   }
    // })
    dispatch({type: "delete_marker", payload: {markerId}})
  } catch (error) {
    
  }
}

const worksiteReady = (dispatch) => async (worksiteId) => {
  try {
    const response = await makeApiRequest(`/worksites/${worksiteId}/worksiteready`, "post", null, dispatch)
    
    if (response && response.success) {
      dispatch({type:"update_worksite", payload:response.data})
      return {success:true}
    } else {
      dispatch({type: 'set_error', payload: 'Virhe päivittäessä työmaan valmiustilaa'});
      return {success:false}
    }
  } catch (error) {
    // console.log('Virhe worksiteReady-funktiossa:', error);
    dispatch({type: 'set_error', payload: 'Virhe päivittäessä työmaan valmiustilaa'});
  }
  
}

const startWorkDay = (dispatch) => async (worksiteId,userId,startTime) => {
   
  try {
    
    const response = await makeApiRequest(`/worksites/${worksiteId}/startday`, 'post', {userId,startTime}, dispatch)
   
    
    dispatch({ type: 'start_work_day', payload: response.data });
  } catch (error) {
    // console.log(error);
  }
}
const endWorkDay = (dispatch) => async (worksiteId, workDayId, endTime) => {
    try {
    // const token = await AsyncStorage.getItem('token');
    // const token = await SecureStore.getItemAsync('token');
    // const authHeader = `${TOKEN_REPLACE} ${token}`;
    const response = await makeApiRequest(`/worksites/${worksiteId}/endday`, 'post', {workDayId, endTime}, dispatch)
    // const response = await rakval.post(`/worksites/${worksiteId}/endday`, { workDayId }, {
    //   headers: { Authorization: authHeader }
    // });

    dispatch({ type: 'end_work_day', payload: response.data });
  } catch (error) {
    // console.log(error);
    // Virheenkäsittely
  }
};

const saveCalendarEntry = (dispatch) => async (worksiteId, date,title,text) => {
  try {
   
    const response = await makeApiRequest(`/worksites/${worksiteId}/calendar-entry`, 'post', {date,title,text}, dispatch)
    
    
    dispatch({type:'add_calendar_entry', payload: response.data})
  } catch (error) {
    
  }
}

const fetchCalendarEntries = (dispatch) => async (worksiteId) => {
  try {
    // const token = await AsyncStorage.getItem('token');
    // const token = await SecureStore.getItemAsync('token');
    // const authHeader = `${TOKEN_REPLACE} ${token}`;
    const response = await makeApiRequest(`/worksites/${worksiteId}/calendar-entries`, 'get', null, dispatch);
    // const response = await rakval.get(`/worksites/${worksiteId}/calendar-entries`, {
    //   headers: {
    //     Authorization: authHeader
    //   }
    // })
    
      dispatch({ type: 'set_calendar_entries', payload: response.data });
    
  } catch (error) {
    // console.log("Virher kalenterimerkintöjen haussa", error);
  }
}

const updateCalendarEntry = (dispatch) => async (worksiteId, entryId, date,title,text) => {

  try {
    // const token = await AsyncStorage.getItem('token');
    // const token = await SecureStore.getItemAsync('token');
    // const authHeader = `${TOKEN_REPLACE} ${token}`;
    const response = await makeApiRequest(`/worksites/${worksiteId}/calendar-entry/${entryId}`, 'put', {date,title,text}, dispatch);
    // const response = await rakval.put(`/worksites/${worksiteId}/calendar-entry/${entryId}`, {date, title, text},{
    //   headers:{
    //     Authorization: authHeader
    //   }
    // })
    dispatch({type: 'update_calendar_entry', payload: {_id: entryId, date, title, text}})
  } catch (error) {
    console.error("Virhe päivitettäessä kalenterimerkintää:", error);
  }

}

const deleteCalendarEntry = (dispatch) => async (worksiteId, entryId,date) => {
  
  try {
    // const token = await AsyncStorage.getItem('token');
    // const token = await SecureStore.getItemAsync('token');
    // const authHeader = `${TOKEN_REPLACE} ${token}`;
    const url = `/worksites/${worksiteId}/calendar-entry/${entryId}?date=${encodeURIComponent(date)}`;
    await makeApiRequest(url, 'delete', null,dispatch);
    // await rakval.delete(url, {
    //   headers: {
    //     Authorization: authHeader
    //   }
    // })
    dispatch({type: 'delete_calendar_entry', payload: {entryId}})
  } catch (error) {
    console.error("Virhe poistettaessa kalenterimerkintää:", error);
  }

}

const deleteProductFromWorksite = (dispatch) => async (worksiteId, productId) => {

  try {
    const url = `/worksites/${worksiteId}/products/${productId}`;
    const response = await makeApiRequest(url, 'delete', null, dispatch);

    dispatch({type: 'delete_product', payload: {productId}})
    return response.data
  } catch (error) {

    // console.log("Virhe poistettaessa tuotetta")
    
  }
}

const updateProduct = (dispatch)  => async (worksiteId, productId, productName, quantity) => {

  try {
    const url = `/worksites/${worksiteId}/products/${productId}`;
    const response = await makeApiRequest(url, 'put', {productName, quantity}, dispatch);

    dispatch({type: 'update_product', payload: {productId, productName, quantity}})
    return response.data
  } catch (error) {
    // console.log("virhe tuotteen muokkauksessa")
  }

}

const addProduct = (dispatch) => async (worksiteId, productData) => {
  try {
    const url = `/worksites/${worksiteId}/add-product`;
    const response = await makeApiRequest(url, 'post', productData, dispatch);

    dispatch({type: 'add_product', payload: response.data})
    return response
  } catch (error) {
    // console.log("virhe tuotteen luomisessa")
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
             floorplankeySend,
             worksiteReady,
             deleteProductFromWorksite,
             updateProduct,
             addProduct,
             getSignedUrl
             },
              { worksites: [], errorMessage: "", currentWorksite: [] });