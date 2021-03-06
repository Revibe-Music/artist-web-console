import React from 'react';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import amplitude from 'amplitude-js'

import store from 'redux/rootReducer';
import App from 'App.js';

import "assets/site/scss/blk-design-system-pro-react.scss?v1.0.0";
import "assets/site/css/nucleo-icons.css";
import "assets/site/css/revibe.css";
import "react-notification-alert/dist/animate.css";

// The ones below were used previously for the artist portal
//import "assets/portal/scss/black-dashboard-pro-react.scss?v=1.0.1";
//import "assets/portal/css/nucleo-icons.css";

var testAmplitudeKey = "5b43a41b914231cea0c15b0ff018959e"
// var prodAmplitudeKey = "ac5bc02f3725f6d6a531b2751e78e1a8"

amplitude.getInstance().init(testAmplitudeKey);


// initialize Google Analytics
const trackingId = "UA-101183111-3";
ReactGA.initialize(trackingId);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
