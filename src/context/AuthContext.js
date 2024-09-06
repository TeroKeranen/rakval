import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import rakval from "../api/rakval";

import { navigate, resetAndNavigate } from '../navigationRef';


import * as SecureStore from 'expo-secure-store';
import { makeApiRequest} from "../api/refreshToken";
// import jwtDecode from 'jwt-decode';


const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signup":
      
      return { ...state,errorMessage: "", token: action.payload.token, user: action.payload.user };
    case "signin":
      return {errorMessage: "", token: action.payload.token, user:action.payload.user};
    case "adminsignup":
      return {...state, errorMessage: "", token: action.payload.token, user:action.payload.user}
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
    case 'update_subscription':
      return {...state,user: {...state.user,subscription: action.payload.subscription,}}

      
    
    default:
      return state;
  }
};



const tryLocalSignin = dispatch => async () => {

  // const token = await AsyncStorage.getItem('token');
  const token = await SecureStore.getItemAsync('token');
  
  

  // if (token && !isTokenExpired(token)) {
    dispatch({type: 'autosignin', payload: token})
    
 

}

// Käytetään puhdistamaan error message
const clearErrorMessage = dispatch => () => {
  dispatch({type: 'clear_error_message'})
}
const logout = (dispatch) => async () => {
  const refreshToken = await SecureStore.getItemAsync('refreshToken')
  if (!refreshToken) {
    
  }

  try {
    await rakval.post('/logout', {refreshToken})

    

    
  } catch (error) {
    console.error("Logout error: ", error);
  }
}


const signup = (dispatch) => {
  
  return async ({ email, password,navigation }) => {
    try {
      
      const response = await rakval.post("/signup", { email, password });

      
      if (response.data.success) {
        const {accessToken, refreshToken} = response.data
        await SecureStore.setItemAsync('token', accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken)
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        // await AsyncStorage.setItem("token", response.data.token);
        dispatch({ type: "signup", payload: { token: accessToken, user: response.data.user } });
        return {success:true}

      }

      
      
      
      
    } catch (err) {
      
      dispatch({
        type: "add_error",
        payload: err.response.data.error,
      });
      return err.response.data
    }
  };
};

const adminSignup = (dispatch) => {
  return async ({email, password,role, companyDetails}) => {
    try {
      
      const response = await rakval.post('/signupAdmin', {email, password,role, companyDetails})
      
      if (response.data.success) {
        const {accessToken, refreshToken} = response.data
        await SecureStore.setItemAsync('token', accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken)
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        // await AsyncStorage.setItem("token", response.data.token);
        dispatch({ type: "adminsignup", payload: { token: accessToken, user: response.data.user } });
        return response.data

      }
      
    } catch (err) {
      
      if (err.response.data.invalidData) {
        return {success:false, invalidData:true}
      } else if (err.response.data.existingUser) {
        
        return {success:false, existingUser: true}
      } else if (err.response.data.passwordtypeError) {
        return {success:false, passwordtypeError: true}
      }else {
        
        return {success:false}
      }
      
      // console.log("Error response data:", err.response ? err.response.data : err.message);
      // dispatch({
      //   type: "add_error",
      //   payload: err.response.data.error,
      // });
    }
  }
}



const signin = (dispatch) => {
  return async ({ email, password }) => {

    
    try {
      const response = await rakval.post("/signin", { email, password });
      
      
      if (response.data.success) {
        const {accessToken, refreshToken} = response.data

        // await AsyncStorage.setItem("token", response.data.token); // tallennetaan token
        await SecureStore.setItemAsync('token', accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken)
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user)) // tallennetaan rooli
        
        dispatch({ type: "signin", payload: {token: accessToken, user: response.data.user} });
        navigate('main');
        return {success:true}
      }
    } catch (err) {
      
      
      dispatch({
        type: "add_error",
        payload: err.response.data.error,
      });
      return {success:false}
    }
  };
};

const deleteAccountRequest = (dispatch) => async (title, text) => {
  try {
    const response = await makeApiRequest(`/sendAccountDelete`, 'post', {title, text}, dispatch);

    // console.log("delteaccountrequest", response);
    if (response.success) {
      return response.data
    } else {
      return response.data
    }
  } catch (error) {
    console.log("delteaccountrequest error", error);
  }
}


// Käytetään tätä kun käyttäjä syöttää verification koodin signupin yhteydessä
const verifyEmail = (dispatch) => {
  return async ({ email, verificationCode }) => {
    try {
      // Lähetä pyyntö käyttäen makeApiRequest-funktiota
      const response = await makeApiRequest('/verify', 'post', { email, verificationCode }, dispatch);
      
      if (response.success) {
        
        dispatch({ type: 'email_verified', payload: response.data.user });
        return { success: true };
      } else {
        // Käsittele muita tilanteita (esim. virheet)
        const errorMsg = response && response.data && response.data.error ? response.data.error : "Failed to verify email";
        return {success:false, message: errorMsg}
      }
    } catch (error) {
      
      
      const message = error.response && error.response.data ? error.response.data.error : error.message || "Failed to verify email";
      console.error("Error verifying email:", message);
      dispatch({ type: 'add_error', payload: error.message || "Failed to verify email" });
      return { success: false };
    }
  }
};


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
    if (response.success) {
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
    //  console.log("User logged out and data removed from AsyncStorage");
    dispatch({type: 'signout'})
    
    
  };
};

const changePassword = dispatch => async ({ oldPassword, newPassword }) => {
  try {
    const response = await makeApiRequest('/change-password', 'post', { oldPassword, newPassword }, dispatch);
    

    if (response.success) {
      return response.data;
    } else {
      
      return response;
    }
  } catch (error) {
    
    return { success: false, message: "Password change failed" }; // Yleinen virheilmoitus
  }
};

const deleteAccount = (dispatch) => {
  return async () => {
    try {
      const response = await makeApiRequest('/deleteAccount', 'delete', null, dispatch);

      if (response.data.success) {
        return response.data;
      }
      
    } catch (error) {
      return {success: false, message: "Deleting account failed"}
      
    }
  }
}

const resetPasswordRequst = (dispatch) => {
  return async (email) => {
    try {
      const response = await rakval.post('/password-reset', {email})
      
      if (response.data.success) {
        return response.data;
      }
    } catch (error) {
      return {success: false, message: "reset passwordrequest failed"}
    }
  }
}

const subscriptionDatabaseUpdate =(dispatch) => async (subscriptionType, durationInMonths) => {
  try {
    
    const response = await makeApiRequest('/updateSubscription', 'post', {subscriptionType, durationInMonths}, dispatch);

    if (response.data.success) {
      return response.data;
    }

  } catch (error) {
    return {success: false, message: "Updating database failed2"}
  }
}


const updateSubscription = (dispatch) => async (subscription) => {
  try {
    const userJson = await AsyncStorage.getItem('user');
    const user = JSON.parse(userJson);
    const updatedUser = {...user, subscription};

    await AsyncStorage.setItem('user', JSON.stringify(updatedUser))

    dispatch({type: 'update_subscription', payload: {subscription}})

    
  } catch (error) {
    console.error('Virhe tilaustietojen päivittämisessä:', error);
  }
}



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

export const { Provider, Context } = createDataContext(authReducer, {
   signin,
   adminSignup,
    signout,
    logout,
    signup,
    fetchUser,
    clearErrorMessage,
    tryLocalSignin,
    joinCompany,
    fetchUserWithId,
    leaveCompany,
    changePassword,
    verifyEmail,
    setUserEmail,
    deleteAccount,
    deleteAccountRequest,
    resetPasswordRequst,
    updateSubscription,
    subscriptionDatabaseUpdate,
    
  }, 
  { token: null, errorMessage: "", user: null, company: null, worksiteUser: null });
