import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import rakval from "../api/rakval";
import { navigate, resetAndNavigate } from "../navigationRef";




const CompanyReducer = (state, action) => {
    switch (action.type) {
      case "add_company":
        return { ...state, company: action.payload };
      case "fetch_company":
        return { ...state, company: action.payload };
      case "set_error":
        return { ...state, errorMessage: action.payload };
      case "clear_company":
        return { ...state, company: null };
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
          const token = await AsyncStorage.getItem("token");
          const response = await rakval.get("/company", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        
          dispatch({ type: "fetch_company", payload: response.data });
        } catch (error) {
          console.log("ei ole fetchcompany dataa", error);
        }
    }
}

// Luodaan uusi yritys
const createCompany = (dispatch) => {
    return async ({name, address, city, code}) => {
        try {
            //   console.log("Lähetettävät tiedot:", { name, address, city, code });
            const token = await AsyncStorage.getItem('token');
            const response = await rakval.post('/createCompany', {name, address, city,code}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            
            // const updatedUser = response.data.user;
            // console.log("testiuser", updatedUser)
            // await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            
            dispatch({type: 'add_company', payload: response.data})

            
            
        } catch (error) {
            dispatch({type: 'set_error', payload: "Jotain meni vikaa (yritysluonnissa)"})
            console.log(error);
            
        }
    }
}

export const {Provider, Context } = createDataContext(CompanyReducer, {createCompany, fetchCompany, clearCompany}, {company: null, errorMessage:''})