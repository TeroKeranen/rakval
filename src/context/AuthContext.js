import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import rakval from "../api/rakval";
import { useContext } from "react";
import { navigate, resetAndNavigate } from '../navigationRef';
import {Context as CompanyContext} from './CompanyContext'
import {TOKEN_REPLACE} from '@env'



const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signup":
      return { errorMessage: "", token: action.payload, user: action.payload.user };
    // case "signin":
    //   return {errorMessage: "", token: action.payload.token, user:action.payload.user};
    case "signin": 
      return {...state, errorMessage: "", token: action.payload.token, user: action.payload.user}
    case "autosignin":
      return {errorMessage: "", token:action.payload};
    case 'clear_error_message':
      return {...state, errorMessage: ''}
    case "fetch_user":
      return {...state, user: action.payload}
    case 'fetch_user_id':
      return {...state, worksiteUser: [action.payload]}
    case 'join_company':
      return {...state, user: action.payload}
    case "signout":
      return {token: null,user: null,company: null, errorMessage: ''};
    case 'leave_company':
      return {...state, user:{...state.user, company: null}}
    default:
      return state;
  }
};

const tryLocalSignin = dispatch => async () => {

  const token = await AsyncStorage.getItem('token');
  

  if (token) {
    dispatch({type: 'autosignin', payload: token})
    
  }

}

// Käytetään puhdistamaan error message
const clearErrorMessage = dispatch => () => {
  dispatch({type: 'clear_error_message'})
}

const signup = (dispatch) => {
  return async ({ email, password }) => {
    try {
      
      const response = await rakval.post("/signup", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      
      
      
      dispatch({ type: "signup", payload: { token: response.data.token, user: response.data.user } });
      // resetAndNavigate('testi');
    } catch (err) {
      console.log(err.response.data.error);
      dispatch({
        type: "add_error",
        payload: err.response.data.error,
      });
    }
  };
};

const signin = (dispatch) => {
  return async ({ email, password }) => {
    try {
      const response = await rakval.post("/signin", { email, password });
     
      await AsyncStorage.setItem("token", response.data.token); // tallennetaan token
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user)) // tallennetaan rooli

      dispatch({ type: "signin", payload: {token: response.data.token, user: response.data.user} });
      navigate('main');
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: err.response.data.error,
      });
    }
  };
};


const joinCompany = (dispatch) => async (companyCode) => {
  try {
    // ... tokenin ja käyttäjän haun koodi ...
      const token = await AsyncStorage.getItem('token');
      const authHeader = `${TOKEN_REPLACE} ${token}`;
      const userJson = await AsyncStorage.getItem('user')
      const user = JSON.parse(userJson)

    const response = await rakval.post(
      "/join-company",
      { userId: user._id, companyCode },
      {
        headers: { Authorization: authHeader },
      }
    );
      
    // Tarkista, että palvelimen vastauksessa on data-kenttä
    if (response.data) {
      const updatedUser = response.data; // Tämä on oletettu päivitetty käyttäjä
      
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "join_company", payload: updatedUser });
      return { success: true }; // Palauta onnistumisen merkki
    } else {
      // Ei dataa vastauksessa
      dispatch({ type: "add_error", payload: "Palvelin ei palauttanut dataa." });
      return { success: false }; // Palauta epäonnistumisen merkki
    }
  } catch (error) {
    dispatch({ type: "add_error", payload: "Tarkista yrityskoodi" });
    return { success: false, error }; // Palauta virheen tiedot
  }
};

const leaveCompany = (dispatch) => async (userId) => {

  try {
    const token = await AsyncStorage.getItem('token');
    const authHeader = `${TOKEN_REPLACE} ${token}`;
    const response = await rakval.post('/leave-company', {userId},{
      headers: {
        Authorization: authHeader
      }
    })
    if (response.data) {
      dispatch({type: 'leave_company'})
      return {success: true}

    } else {
      return {success:false}
    }
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}

// Haetaan käyttäjän tiedot 
const fetchUser = (dispatch) => async () => {
  try {

    const token = await AsyncStorage.getItem('token');
    const authHeader = `${TOKEN_REPLACE} ${token}`;
    // const storedUser = await AsyncStorage.getItem('user');
    // const user = JSON.parse(storedUser)
    

    if (token) {
      const response = await rakval.get('/profile', {
        headers: {Authorization: authHeader}
      })
      
      
      dispatch({type: 'fetch_user', payload: response.data})
    }
  } catch (error) {
    console.log("something goes wrong")
    
  }
}

// haetaan käyttäjän tiedot id perusteella. Tätä käytetään worksiteWorkers.js tiedostossa kun näytämme listan jotka on lisätty työmaahan
const fetchUserWithId = (dispatch) => {
  return async (userId) => {
    try {
      
      const token = await AsyncStorage.getItem('token');
      const authHeader = `${TOKEN_REPLACE} ${token}`;
      const response = await rakval.get(`/users/${userId}`, {
        headers: {
          Authorization: authHeader
        }
      })
      
      return response.data;
      
    } catch (error) {
      
    }
  }
}

const signout = (dispatch) => {
  return async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('company');
    await AsyncStorage.clear();
     console.log("User logged out and data removed from AsyncStorage");
    dispatch({type: 'signout'})
    
    
  };
};

export const { Provider, Context } = createDataContext(authReducer, { signin, signout, signup, fetchUser, clearErrorMessage, tryLocalSignin, joinCompany, fetchUserWithId, leaveCompany }, { token: null, errorMessage: "", user: null, company: null, worksiteUser: null });
