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