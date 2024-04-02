import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import rakval from "../api/rakval";
import { useContext } from "react";
import { navigate, resetAndNavigate } from '../navigationRef';
import {Context as CompanyContext} from './CompanyContext'
import {TOKEN_REPLACE} from '@env'
import * as SecureStore from 'expo-secure-store';
import { makeApiRequest} from "../api/refreshToken";
// import jwtDecode from 'jwt-decode';


const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signup":
      return { ...state,errorMessage: "", token: action.payload.token, user: action.payload.user };
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
      return {token: null,refreshToken: null,user: null,company: null, errorMessage: ''};
    case 'leave_company':
      return {...state, user:{...state.user, company: null}}
    case 'email_verified':
      return {...state, user:{...state.user, isVerified: true}}
    case "set_email":
      return {...state, email: action.payload}
    case "update_token":
      return {...state, token:action.payload}
    
    default:
      return state;
  }
};



const tryLocalSignin = dispatch => async () => {

  // const token = await AsyncStorage.getItem('token');
  const token = await SecureStore.getItemAsync('token');
  
  

  // if (token && !isTokenExpired(token)) {
    dispatch({type: 'autosignin', payload: token})
    
  // } else {
  //   console.log("token vanhentunut");
  //         const refreshToken = await SecureStore.getItemAsync('refreshToken');
  //         const response = await rakval.post('/refresh', { token: refreshToken });

  //   if (response.status === 200) {
  //           const { accessToken } = response.data;
  //           await SecureStore.setItemAsync('token', accessToken);
  //           dispatch({ type: 'update_token', payload: accessToken });
  //           return accessToken;
  //         } else {
  //           // Käsittele virhetilanne (esim. ohjaa kirjautumissivulle)
  //           console.log("jotain meni vikaan")
  //         }
          
  // }

}

// Käytetään puhdistamaan error message
const clearErrorMessage = dispatch => () => {
  dispatch({type: 'clear_error_message'})
}
const logout = (dispatch) => async () => {
  const refreshToken = await SecureStore.getItemAsync('refreshToken')
  if (!refreshToken) {
    console.log("Ei refrestokenia");
  }

  try {
    await rakval.post('/logout', {refreshToken})

    // await SecureStore.deleteItemAsync('token');
    // await SecureStore.deleteItemAsync('refreshToken');
    // await AsyncStorage.removeItem('user');
    // await AsyncStorage.removeItem('company');
    // await AsyncStorage.clear();
    // console.log("User logged out and data removed from AsyncStorage");
    // dispatch({type: 'signout'})

    
  } catch (error) {
    console.error("Logout error: ", error);
  }
}
const signup = (dispatch) => {
  
  return async ({ email, password,navigation }) => {
    try {
      
      const response = await rakval.post("/signup", { email, password });
      const {accessToken, refreshToken} = response.data

      await SecureStore.setItemAsync('token', accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken)
      // await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      
      
      
      dispatch({ type: "signup", payload: { token: accessToken, user: response.data.user } });
      
    } catch (err) {
      console.log(err.response.data.error);
      dispatch({
        type: "add_error",
        payload: err.response.data.error,
      });
      throw new Error(err.response.data.error);
    }
  };
};



const signin = (dispatch) => {
  return async ({ email, password }) => {
    try {
      const response = await rakval.post("/signin", { email, password });
      const {accessToken, refreshToken} = response.data
     
      // await AsyncStorage.setItem("token", response.data.token); // tallennetaan token
      await SecureStore.setItemAsync('token', accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken)
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user)) // tallennetaan rooli

      dispatch({ type: "signin", payload: {token: accessToken, user: response.data.user} });
      navigate('main');
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: err.response.data.error,
      });
    }
  };
};


// Käytetään tätä kun käyttäjä syöttää verification koodin signupin yhteydessä
const verifyEmail = (dispatch) => {
  return async ({ email, verificationCode }) => {
    try {
      // Lähetä pyyntö käyttäen makeApiRequest-funktiota
      const response = await makeApiRequest('/verify', 'post', { email, verificationCode }, dispatch);

      if (response.status === 200) {
        dispatch({ type: 'email_verified', payload: response.data.user });
        return { success: true };
      } else {
        // Käsittele muita tilanteita (esim. virheet)
        throw new Error(response.data.error || "Failed to verify email");
      }
    } catch (error) {
      console.error("Error verifying email:", error.message);
      dispatch({ type: 'add_error', payload: error.message || "Failed to verify email" });
      return { success: false };
    }
  }
};
// const verifyEmail = (dispatch) => {
//   return async ({email, verificationCode}) => {
    
//     try {
//       // const token = await AsyncStorage.getItem('token');
//       const token = await SecureStore.getItemAsync('token');
//       const authHeader = `${TOKEN_REPLACE} ${token}`;
      
//       const response = await rakval.post('/verify', {email, verificationCode}
//       )
      
//       dispatch({type: 'email_verified', payload: response.data.user})
//       return({success:true})
//     } catch (error) {
//       console.log("Error verifying email:", error.response?.data?.error || "Failed to verify email");
//       // Välitä tarkempi virheviesti dispatch-kutsussa
//       dispatch({ type: 'add_error', payload: error.response?.data?.error || "Failed to verify email" });
//       return({success: false})
//     }
//   }
// }

// Kätetään kun käyttäjä ei heti syötä verification koodia, vaan menee myöhemmin signin kauttaa, ja hänellä ei ole koodia syötettynä.
const setUserEmail = (dispatch) => (email) => {
  dispatch({type:"set_email", payload: email})
}


const joinCompany = (dispatch) => async (companyCode) => {
  try {
    const userJson = await AsyncStorage.getItem('user');
    const user = JSON.parse(userJson);

    // Käytä makeApiRequest-funktiota API-pyynnön tekemiseen
    const response = await makeApiRequest(
      '/join-company',
      'post',
      { userId: user._id, companyCode },
      dispatch
    );

    // Tarkista, että palvelimen vastauksessa on data-kenttä
    if (response.data) {
      const updatedUser = response.data; // Tämä on oletettu päivitetty käyttäjä
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "join_company", payload: updatedUser });
      return { success: true };
    } else {
      dispatch({ type: "add_error", payload: "Palvelin ei palauttanut dataa." });
      return { success: false };
    }
  } catch (error) {
    console.error('Virhe yritykseen liittymisessä:', error);
    dispatch({ type: "add_error", payload: "Tarkista yrityskoodi" });
    return { success: false, error };
  }
};

// const leaveCompany = (dispatch) => async (userId) => {

//   try {
//     // const token = await AsyncStorage.getItem('token');
//     const token = await SecureStore.getItemAsync('token');
//     const authHeader = `${TOKEN_REPLACE} ${token}`;
//     const response = await rakval.post('/leave-company', {userId},{
//       headers: {
//         Authorization: authHeader
//       }
//     })
//     if (response.data) {
//       dispatch({type: 'leave_company'})
//       return {success: true}

//     } else {
//       return {success:false}
//     }
//   } catch (error) {
//     console.log(error);
//     return { success: false, error };
//   }
// }
const leaveCompany = (dispatch) => async (userId) => {
  try {
    // Käytä makeApiRequest-funktiota API-pyynnön tekemiseen
    const response = await makeApiRequest(
      '/leave-company',
      'post',
      { userId },
      dispatch
    );

    if (response.data) {
      dispatch({ type: 'leave_company' });
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error('Virhe yrityksestä poistumisessa:', error);
    dispatch({ type: "add_error", payload: "Virhe yrityksestä poistumisessa" });
    return { success: false, error };
  }
};

// Haetaan käyttäjän tiedot 
const fetchUser = (dispatch) => async () => {
  try {
    // Huomaa, että Axios käsittelee vastausta automaattisesti, joten ei tarvitse kutsua .json()
    const response = await makeApiRequest('/profile', 'get', null, dispatch);

    
    dispatch({ type: 'fetch_user', payload: response.data });
  } catch (error) {
    console.error('Virhe haettaessa käyttäjän tietoja:', error.message);
    // Käsittele virhetilanne, esim. näyttämällä virheilmoitus
  }
};

// const fetchUser = (dispatch) => async () => {
  
//   try {

//     // const token = await AsyncStorage.getItem('token');
//     const token = await SecureStore.getItemAsync('token');
//     const authHeader = `${TOKEN_REPLACE} ${token}`;
//     // const storedUser = await AsyncStorage.getItem('user');
//     // const user = JSON.parse(storedUser)
    

//     if (token) {
//       const response = await rakval.get('/profile', {
//         headers: {Authorization: authHeader}
//       })
      
      
//       dispatch({type: 'fetch_user', payload: response.data})
//     }
//   } catch (error) {
//     console.log("something goes wrong")
    
//   }
// }

// haetaan käyttäjän tiedot id perusteella. Tätä käytetään worksiteWorkers.js tiedostossa kun näytämme listan jotka on lisätty työmaahan
const fetchUserWithId = (dispatch) => {
  return async (userId) => {
    try {
      const response = await makeApiRequest(`/users/${userId}`, 'get', null, dispatch);
      
      return response.data;
    } catch (error) {
      console.error('Virhe haettaessa käyttäjän tietoja:', error);
      return null; // Voit palauttaa null tai käsitellä virhettä muulla tavalla
    }
  }
};
// const fetchUserWithId = (dispatch) => {
//   return async (userId) => {
//     try {
      
//       // const token = await AsyncStorage.getItem('token');
//       const token = await SecureStore.getItemAsync('token');
//       const authHeader = `${TOKEN_REPLACE} ${token}`;
//       const response = await rakval.get(`/users/${userId}`, {
//         headers: {
//           Authorization: authHeader
//         }
//       })
      
//       return response.data;
      
//     } catch (error) {
      
//     }
//   }
// }

const signout = (dispatch) => {
  return async () => {
    // await AsyncStorage.removeItem('token');
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('refreshToken');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('company');
    await AsyncStorage.clear();
     console.log("User logged out and data removed from AsyncStorage");
    dispatch({type: 'signout'})
    
    
  };
};

const changePassword = dispatch => async ({ oldPassword, newPassword }) => {
  try {
    const response = await makeApiRequest('/change-password', 'post', { oldPassword, newPassword }, dispatch);
    
    if (response.status === 200) {
      // Oletetaan, että onnistunut vastaus tarkoittaa, että salasanan vaihto onnistui
      return { success: true };
    } else {
      // Käsittele muita tilanteita, kuten mahdollisia virheitä
      const errorData = await response.data;
      return { success: false, message: errorData.error || "Salasanan vaihto epäonnistui" };
    }
  } catch (error) {
    
    dispatch({ type: "add_error", payload: error.message || "Salasanan vaihto epäonnistui" });
    return { success: false, message: error.message || "Salasanan vaihto epäonnistui" };
  }
};
// const changePassword = dispatch => async  ({oldPassword, newPassword}) => {

//   try {
//     // const token = await AsyncStorage.getItem('token')
//     const token = await SecureStore.getItemAsync('token');
//     const authHeader = `${TOKEN_REPLACE} ${token}`;
//     const response = await rakval.post('/change-password', {oldPassword, newPassword}, {
//       headers: {
//         Authorization: authHeader
//       }
//     })
    
//     if (response.data) {
//       return {success: true}
//     } 
//   } catch (error) {

//     dispatch({type: "add_error", payload: "salasanana vaihto epäonnistui"})
//     return {success:false}
    
    
//   }
// }

export const { Provider, Context } = createDataContext(authReducer, { signin, signout,logout, signup, fetchUser, clearErrorMessage, tryLocalSignin, joinCompany, fetchUserWithId, leaveCompany,changePassword,verifyEmail,setUserEmail}, { token: null, errorMessage: "", user: null, company: null, worksiteUser: null });
