import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import Main from "./pages/Main";
import Result from "./pages/Result";

export const routes = {
  resultPage: "/result",
  mainPage: "/",
};

export function createNavigationHandler(history, route, queryParams = {}) {
  let queryParamsString = new URLSearchParams(queryParams).toString();
  if (queryParamsString) {
    queryParamsString = `?${queryParamsString}`;
  }

  return () => {
    history.push({
      pathname: route,
      search: queryParamsString,
    });
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
