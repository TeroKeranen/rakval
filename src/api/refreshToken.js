import * as SecureStore from 'expo-secure-store';
import rakval from './rakval';

export const makeApiRequest = async (endpoint, method, data, dispatch) => {
  let token = await SecureStore.getItemAsync('token');
  let headers = { Authorization: `Bearer ${token}` };

  try {
    const response = await rakval({ url: endpoint, method, data, headers });
    
    return { success: true, data: response.data };
  } catch (error) {
    
    if (error.response) {
      
      switch (error.response.status) {
        case 401: // Token vanhentunut
          const newToken = await refreshAccessToken(dispatch);
          if (newToken) {
            headers.Authorization = `Bearer ${newToken}`;
            const retryResponse = await rakval({ url: endpoint, method, data, headers });
            return { success: true, data: retryResponse.data };
          } else {
            throw new Error('Token renewal failed');
          }
        case 400:
          return {success:false, message: error.response.data.error || "Somethin goes wrong"}
        case 403:
          
          return { success: false, paidUser: false};
          
        case 404:
          return { success: false, message: error.response.data.error || "Resource not found." };
        case 422:
          return { success: false, message: error.response.data.error || "Data validation failed." };
        default:
          console.log("API error:", error.response.data.error);
          break;
      }
    }
    throw error; // Heittää virheen uudelleen, jos sitä ei ole käsitelty
  }
};

 export const refreshAccessToken = async (dispatch) => {
    
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