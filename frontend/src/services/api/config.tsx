import {IApiRequestContent, IApiRequest, apiCall} from "../../utilities/lib/axios.tsx";
import {CONFIG} from "../../constants/api/config";


const getConfig = async (apiRequestContent: IApiRequestContent) => {
    const apiRequest: IApiRequest = {
        method: 'GET',
        path: CONFIG.get.config.path,
        content: apiRequestContent,
    };
    const response = await apiCall(apiRequest);
    return response;
}

export default getConfig;