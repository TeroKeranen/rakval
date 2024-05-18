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
      case 'set_workers':
        return {...state, workers:action.payload}
      case "set_error":
        return { ...state, errorMessage: action.payload };
      case "clear_company":
        return { ...state, company: null, workers:[] };
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
          console.log("ei ole fetchcompany dataa", error);
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
            console.log(error);
            
        }
    }
}

export const {Provider, Context } = createDataContext(CompanyReducer, {createCompany, fetchCompany, clearCompany,fetchWorkers}, {workers:[],company: null, errorMessage:''})