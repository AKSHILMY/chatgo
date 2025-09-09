import React from "react";


export interface IRouteBase{
    path: string;
    component: React.ComponentType;
    name?:string;
}