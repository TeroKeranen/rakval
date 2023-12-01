import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import rakval from "../api/rakval";


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
        const token = await AsyncStorage.getItem('token');
        const response = await rakval.get('/events', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        dispatch({type: "fetch_events", payload: response.data})

    } catch (error) {
        console.log("fetcheventsERROR", error);
    }
}



export const {Provider, Context} = createDataContext(eventsReducer, {fetchEvents,clearEvents}, {events: []})