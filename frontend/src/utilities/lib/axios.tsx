import axios from "axios";

import { Method } from "axios"

export interface IApiRequest {
    method : Method,
    path: string
    content : IApiRequestContent
}
export interface IApiRequestContent{
    pathParams?: Record<string, unknown> | undefined,
    queryParams?: Record<never, never> | undefined,
    data?: object | undefined,
}

axios.defaults.baseURL = import.meta.env.VITE_CHATGO_BASE_URL

// No authorization header is set here
const axiosInstance = axios.create({
    headers: {"Content-Type": "application/json",}
});

const createAxiosRequest = (apiRequest : IApiRequest) => {
    const options = {
        method : apiRequest.method,
        url : createUrl(apiRequest),
        data : apiRequest.content.data

    }
    return options
}

const appendPathParams = (
    url: string,
    pathParams: Record<string, unknown> = {}
): string => {
    const names = url.match(/(\/{.+?})/g);
    if (!names || !names.length) return url;

    const transformedUrl = names.reduce((acc, name) => {
        const paramName = name.replace(/[/{}]/g, '');
        const paramValue = pathParams[paramName];

        const urlValue = `/${paramValue}`;

        if (!paramValue) {
            return acc.replace(name, '');
        }

        return acc.replace(name, urlValue);
    }, url);

    return transformedUrl;
};

const createUrl = (
    apiRequest : IApiRequest
): string => {
    apiRequest.path = appendPathParams(apiRequest.path,apiRequest.content.pathParams);
    if (!apiRequest.content.queryParams) {
        return apiRequest.path;
    }

    const queryString = new URLSearchParams(apiRequest.content.queryParams).toString();


    return apiRequest.path + '?' + queryString;
};

const apiCall = (
    apiRequest : IApiRequest,
) => {
    const axiosRequestConfig = createAxiosRequest(apiRequest);
    return axiosInstance.request(axiosRequestConfig).then((response) => {return (response)})
}

export {axiosInstance,apiCall}