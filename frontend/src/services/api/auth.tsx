import {IApiRequestContent, IApiRequest, apiCall} from "../../utilities/lib/axios.tsx";
import {AUTH} from "../../constants/api/auth";

const signUp = (apiRequestContent: IApiRequestContent) => {
    const apiRequest: IApiRequest = {
        method: 'POST', // or any other method you intend to use
        path: AUTH.post.signup.path, // Replace with the appropriate path
        content: apiRequestContent,
    };
    return apiCall(apiRequest).then((response) => {
        return response
    })
}

const logIn = (apiRequestContent: IApiRequestContent) => {
    const apiRequest: IApiRequest = {
        method: 'POST', // or any other method you intend to use
        path: AUTH.post.login.path, // Replace with the appropriate path
        content: apiRequestContent,
    };
    return apiCall(apiRequest).then((response) => {
        return response
    })
}

export {signUp, logIn}