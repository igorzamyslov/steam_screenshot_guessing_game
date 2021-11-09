import About from "@/pages/About";
import Main from "@/pages/Main";
import Result from "@/pages/Result";
import Leaderboard from "@/pages/Leaderboard";
import ga4 from "react-ga4";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import ym from "react-yandex-metrika";

export const routes = {
  resultPage: "/result",
  aboutPage: "/about",
  leaderboardPage: "/leaderboard",
  mainPage: "/",
};

export function createNavigationHandler(history, route, queryParams = {}) {
  let queryParamsString = new URLSearchParams(queryParams).toString();
  if (queryParamsString) {
    queryParamsString = `?${queryParamsString}`;
  }
  // Log yandex metrics navigation
  return () => {
    ga4.send({ hitType: "pageview", page: route });
    ym("hit", route, { params: queryParams });
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
      <Route exact path={routes.aboutPage} component={About} />
      <Route exact path={routes.leaderboardPage} component={Leaderboard} />
      <Redirect to={routes.mainPage} />
    </Switch>
  </BrowserRouter>
);
