import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import rakval from "../api/rakval";
import { navigate, resetAndNavigate } from "../navigationRef";
import {TOKEN_REPLACE} from '@env'
import * as SecureStore from 'expo-secure-store';
import { makeApiRequest, refreshAccessToken } from "../api/refreshToken";




const CompanyReducer = (state, action) => {
    switch (action.type) {
      case "add_company":
        return { ...state, company: action.payload };
      case "fetch_company":
        return { ...state, company: action.payload };
      case "set_products":
        
          return { ...state, products: action.payload }; // Päivitetään tuotteet tilassa
      case 'set_workers':
        return {...state, workers:action.payload}
      case "set_error":
        return { ...state, errorMessage: action.payload };
      case "clear_company":
        return { ...state, company: null, workers:[] };
        case "update_worker_role":
          return {
            ...state,
            workers: state.workers.map((worker) =>
              worker._id === action.payload.userId
                ? { ...worker, role: action.payload.newRole }
                : worker
            ),
          };
      default:
        return state;
    }
}

const clearCompany = (dispatch) => {
  return () => {
    dispatch({ type: "clear_company" });
  };
};
//Haetaan yrityksen tietota
const fetchCompany = (dispatch) => {
  return async () => {
    try {
          
 
          const response = await makeApiRequest('/company', 'get', null, dispatch);
          
          
          dispatch({ type: "fetch_company", payload: response.data });
        } catch (error) {
          
        }
    }
}

// Haetaan yrityksen työntekijät
const fetchWorkers = (dispatch) => {
  return async (companyId) => {
    try {
      
      // const token = await AsyncStorage.getItem('token');
      // const token = await SecureStore.getItemAsync('token');
      // const authHeader = `${TOKEN_REPLACE} ${token}`;
      const response = await makeApiRequest(`/company/${companyId}/users`, 'get', null, dispatch)
      // const response = await rakval.get(`/company/${companyId}/users`, {
      //   headers: {
      //     Authorization: authHeader
      //   }
      // })
      
      dispatch({type: 'set_workers', payload: response.data})
    } catch (error) {
      
    }
  }
}

// Luodaan uusi yritys
const createCompany = (dispatch) => {
    return async ({name, address, city, code}) => {
        
        try {
            
            const response = await makeApiRequest('/createCompany', 'post', {name,address,city,code}, dispatch)
            
            if (response.success) {
              
              dispatch({type: 'add_company', payload: response.data})
              return { success: true };
            } else {
              dispatch({type:'set_error', payload: response.message})
              return { success: false };
            }

            
            
        } catch (error) {
            dispatch({type: 'set_error', payload: "Jotain meni vikaa (yritysluonnissa)"})
            
            
        }
    }
}

const addCompanyProduct = (dispatch) => {
  return async ({ companyId, barcode, name, description, quantity, price }) => {

    
    try {

      const response = await makeApiRequest('/companyAddProducts', 'post', {
        companyId,
        barcode,
        name,
        description,
        quantity,
        price
      })

      

      if (response && response.data) {
        dispatch({type: 'fetch_company', payload: response.data})
        return {success:true}
      } else {
        dispatch({type: 'set_error', payload: 'tuotetta lisättäessä tapahtui virhe'})
        return {success: false, error: response.message}
      }
    } catch (error) {
      dispatch({ type: 'set_error', payload: 'Tuotetta lisättäessä tapahtui virhe' });
      return { success: false, error: error.message || 'Tuotteen lisäys epäonnistui' };
    }
  }
}

const getCompanyProducts = (dispatch) => {
  return async (companyId) => {
    try {
      const response = await makeApiRequest(`/companyProducts?companyId=${companyId}`, 'get', null, dispatch)


      // console.log("reeesdlkdlkalksöl ", response);

      if (response && response.data) {
        dispatch({ type: 'set_products', payload: response.data });
        return { success: true };
    } else {
        dispatch({ type: 'set_error', payload: 'Tuotteiden hakemisessa tapahtui virhe' });
        return { success: false, error: response.message };
    }
    } catch (error) {
      dispatch({ type: 'set_error', payload: 'Tuotteiden hakemisessa tapahtui virhe' });
      return { success: false, error: error.message || 'Tuotteiden haku epäonnistui' };
    }
  }
}

const updateUserRole = (dispatch) => async (userId, newRole) => {

  try {
    const response = await makeApiRequest(`/update-role/${userId}`, 'put', {role: newRole}, dispatch)

    if (response.success) {
      const updatedUser = response.data.user;
      dispatch({ type: "update_worker_role", payload: { userId, newRole } });
      return { success: true };
    } else {
      dispatch({ type: 'set_error', payload: 'Roolin päivittämisessä tapahtui virhe' });
      return { success: false };
    }
  } catch (error) {
    dispatch({ type: "add_error", payload: "Virhe roolin päivittämisessä" });
    return { success: false, error };
  }
}


export const {Provider, Context } = createDataContext(CompanyReducer, {createCompany, fetchCompany, clearCompany,fetchWorkers,addCompanyProduct, getCompanyProducts, updateUserRole}, {workers:[],company: null, errorMessage:''})