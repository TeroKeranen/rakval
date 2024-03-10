import * as SecureStore from 'expo-secure-store';
import rakval from './rakval';

export const makeApiRequest = async (endpoint, method, data, dispatch) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const headers = { Authorization: `Bearer ${token}` };
  
      try {
        const response = await rakval({ url: endpoint, method, data, headers });
  
        return response;
      } catch (error) {
        
        if (error.response && error.response.status === 401) {
          // Token on vanhentunut, yritä uusia se
          const newToken = await refreshAccessToken(dispatch);
          if (newToken) {
            // Yritä pyyntöä uudelleen uudella tokenilla
            headers.Authorization = `Bearer ${newToken}`;
            return await rakval({ url: endpoint, method, data, headers });
          } else {
            throw new Error('Token renewal failed');
          }
        }else if (error.response && error.response.status === 404) {
          return {success:false, message: error.response.data.error || "tapahtui virhe"}
        } else if (error.response && error.response.status === 422) {
          return {success:false, message: error.response.data.error || "tapahtui virhe"}
        } else {
          return {success:false, message: error.response.data.error || "tapahtui virhe"}
        }
      }
    } catch (error) {
      console.error('Error in makeApiRequest:', error);
      throw error;
    }
  };

 export const refreshAccessToken = async (dispatch) => {
    console.log("suoritetaan refresh token");
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      const response = await rakval.post('/refresh', { token: refreshToken });
  
      if (response.status === 200) {
        const { accessToken } = response.data;
        await SecureStore.setItemAsync('token', accessToken);
        dispatch({ type: 'update_token', payload: accessToken });
        return accessToken;
      } else {
        // Käsittele virhetilanne (esim. ohjaa kirjautumissivulle)
      }
    } catch (error) {
      console.error('Virhe uusittaessa access tokenia:', error);
      // Käsittele virhetilanne
    }
  };