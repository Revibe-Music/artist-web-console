import React from 'react';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
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


// initialize Google Analytics
const trackingId = "UA-101183111-3";
ReactGA.initialize(trackingId);

// initialize reducers
const reducer = combineReducers({
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
