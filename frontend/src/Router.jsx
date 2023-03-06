import About from "@/pages/About";
import Game from "@/pages/Game";
import Leaderboard from "@/pages/Leaderboard";
import Menu from "@/pages/Menu";
import Result from "@/pages/Result";
import ga4 from "react-ga4";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import ym from "react-yandex-metrika";
import GeneratedQuiz from "@/pages/GeneratedQuiz";
import AiPage from "@/pages/AiPage";

export const routes = {
  menuPage: "/",
  gamePage: "/game",
  resultPage: "/result",
  aboutPage: "/about",
  leaderboardPage: "/leaderboard",
  generatedQuiz: "/generated",
  aiPage: "/ai-page",
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
      <Route exact path={routes.menuPage} component={Menu} />
      <Route exact path={routes.gamePage} component={Game} />
      <Route exact path={routes.resultPage} component={Result} />
      <Route exact path={routes.aboutPage} component={About} />
      <Route exact path={routes.leaderboardPage} component={Leaderboard} />
      <Route exact path={routes.generatedQuiz} component={GeneratedQuiz} />
      <Route exact path={routes.aiPage} component={AiPage} />
      <Redirect to={routes.menuPage} />
    </Switch>
  </BrowserRouter>
);
