/*!

=========================================================
* Black Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/


import ReactDOM from 'react-dom';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { sessionService, sessionReducer } from 'redux-react-session';
import thunkMiddleware from 'redux-thunk';
import { authenticationReducer } from './redux/authentication/reducers.js'
import { mediaReducer } from './redux/media/reducers.js'
import App from 'App.js';

import "assets/site/scss/blk-design-system-pro-react.scss?v1.0.0";
import "assets/site/css/nucleo-icons.css";
import "react-notification-alert/dist/animate.css";

// The ones below were used previously for the artist portal
//import "assets/portal/scss/black-dashboard-pro-react.scss?v=1.0.1";
//import "assets/portal/css/nucleo-icons.css";

// Add the sessionReducer
const reducer = combineReducers({
  // session: sessionReducer
  media: mediaReducer,
  authentication: authenticationReducer
});

const store = createStore(reducer, undefined, compose(applyMiddleware(thunkMiddleware)));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
