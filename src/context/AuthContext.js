
import createDataContext from "./createDataContext";
import rakval from "../api/rakval";

const authReducer = (state, action) => {

    switch (action.type) {
        default:
            return state;
    }

}

const signup = (dispatch) => {
    return async ({email, password}) => {

        try {
            const response = await rakval.post('/signup', {email, password})
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }

    }
}

const signin = (dispatch) => {
    return () => {

    }
}

const signout = (dispatch) => {
    return () => {

    }
}

export const {Provider, Context} = createDataContext(
    authReducer,
    {signin, signout, signup},
    { isSignedIn: false}
)