import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import rakval from "../api/rakval";
import { navigate, resetAndNavigate } from '../navigationRef';


const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signup":
      return { errorMessage: "", token: action.payload };
    case "signin":
      return {errorMessage: "", token: action.payload};
    case 'clear_error_message':
      return {...state, errorMessage: ''}
    case "fetch_user":
      return {...state, user: action.payload}
    default:
      return state;
  }
};


// Käytetään puhdistamaan error message
const clearErrorMessage = dispatch => () => {
  dispatch({type: 'clear_error_message'})
}

const signup = (dispatch) => {
  return async ({ email, password }) => {
    try {
      const response = await rakval.post("/signup", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      console.log(response.data.token);
      dispatch({ type: "signup", payload: response.data.token });
      // resetAndNavigate('testi');
    } catch (err) {
      console.log(err);
      dispatch({
        type: "add_error",
        payload: "Something went wrong with sign up",
      });
    }
  };
};

const signin = (dispatch) => {
  return async ({ email, password }) => {
    try {
      const response = await rakval.post("/signin", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      dispatch({ type: "signin", payload: response.data.token });
      
    } catch (error) {
      dispatch({
        type: "add_error",
        payload: "Something wen wrong with sign in",
      });
    }
  };
};


// Haetaan käyttäjän tiedot 
const fetchUser = (dispatch) => async () => {
  try {

    const token = await AsyncStorage.getItem('token');

    if (token) {
      const response = await rakval.get('/profile', {
        headers: {Authorization: `Bearer ${token}`}
      })
      
      dispatch({type: 'fetch_user', payload: response.data})
    }
    
  } catch (error) {
    console.log("something goes wrong")
    
  }
}

const signout = (dispatch) => {
  return () => {
    // somehow sign out!!!
  };
};

export const { Provider, Context } = createDataContext(authReducer, { signin, signout, signup, fetchUser, clearErrorMessage }, { token: null, errorMessage: "" });
