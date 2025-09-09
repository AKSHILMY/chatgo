import { IRouteBase as IRoute } from "./models/IRoute"
import { Route} from "react-router-dom";
const routerMiddleWare = (routes: IRoute[]) => {
    const routers = routes.map((route : IRoute) => {
        return <Route key={route.path} path={route.path} element={route.component ? <route.component /> : null} ></Route>
    })
    return <Route>{routers}</Route>
}

export default routerMiddleWare;