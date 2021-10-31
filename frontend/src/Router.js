import Main from "./pages/Main";
import Result from "./pages/Result";

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

export const routes = {
  resultPage: "/result",
  mainPage: "/",
}

export function createNavigationHandler(history, route) {
  return () => { history.push(route) };
}

export const Router = () => (
    <BrowserRouter>
      <Switch>
        <Route exact path={routes.resultPage} component={Result} />
        <Route exact path={routes.mainPage} component={Main} />
        <Redirect to={routes.mainPage} />
      </Switch>
    </BrowserRouter>
);
