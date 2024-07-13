import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import rakval from "../api/rakval";
import {TOKEN_REPLACE} from '@env'
import * as SecureStore from 'expo-secure-store';
import { makeApiRequest, refreshAccessToken } from "../api/refreshToken";


const eventsReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_events':
            return {...state, events: action.payload}
        case 'clear_events':
            return {...state, events:[]}
        default:
            return state;
    }
}


const clearEvents = (dispatch) => {
  
    return () => {
  
      dispatch({type:'clear_events'})
    }
  }


const fetchEvents = (dispatch) => async () => {
    try {
        

        const response = await makeApiRequest('/events', 'get', null, dispatch)

        
        dispatch({type: "fetch_events", payload: response.data})

    } catch (error) {
        
    }
}



export const {Provider, Context} = createDataContext(eventsReducer, {fetchEvents,clearEvents}, {events: []})