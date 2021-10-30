import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";

import React from "react";
import ReactDOM from "react-dom";

import Main from "./pages/Main";
import Result from "./pages/Result";

import {
  BrowserRouter as BrowserRouter,
  Switch,
  Route
} from "react-router-dom";

import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route path="/result">
          <Result />
        </Route>
        <Route path="/">
          <Main />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>
  ,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
