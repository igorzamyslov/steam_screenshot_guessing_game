import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import Main from "./pages/Main";
import Result from "./pages/Result";

export const routes = {
  resultPage: "/result",
  mainPage: "/",
};

export function createNavigationHandler(history, route) {
  return () => {
    history.push(route);
  };
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
