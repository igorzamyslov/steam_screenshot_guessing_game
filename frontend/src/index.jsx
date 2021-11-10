import "./index.css";

import combinedReducers from "@/reducers";
import { Router } from "@/Router";
import React from "react";
import ReactDOM from "react-dom";
import ga4 from "react-ga4";
import { Provider } from "react-redux";
import { YMInitializer } from "react-yandex-metrika";
import { createStore } from "redux";

import reportWebVitals from "./reportWebVitals";

const store = createStore(combinedReducers);

function enableGA4() {
  ga4.initialize("G-3VBTV1Z6NQ");
}

ReactDOM.render(
  <React.StrictMode>
    <YMInitializer
      accounts={[86201639]}
      options={{
        webvisor: true,
        defer: true,
        trackLinks: true,
        clickmap: true,
      }}
      version="2"
    />
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

enableGA4();
