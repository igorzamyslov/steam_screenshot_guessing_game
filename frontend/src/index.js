import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import combinedReducers from "reducers"
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router } from "Router";

import reportWebVitals from "./reportWebVitals";

console.log(combinedReducers);
const store = createStore(combinedReducers);
console.log(store.getState());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} >
      <Router />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
