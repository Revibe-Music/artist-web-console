// This component handles the App template used on every page.
import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Switch, Link } from 'react-router-dom';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import { Prompt } from 'react-router'
import { connect } from 'react-redux';

import Authenticated from './layouts/Authenticated.js';
import PrivateRoute from './routes/PrivateRoute.js';

import Login from 'views/Authentication/Login.jsx';
import Register from 'views/Authentication/Register.jsx';
import RegisterArtist from 'views/Authentication/RegisterArtist.jsx';

import Home from 'views/Site/Home.jsx'
import ContactUs from 'views/Site/ContactUs.jsx';
import Error400 from 'views/Site/Error400.jsx'
import Error404 from 'views/Site/Error404.jsx'
import AboutUs from "views/Site/AboutUs.jsx"
import WhyRevibe from "views/Site/WhyRevibe.jsx"
import CatchAllPage from "views/catchAll.js"

import { builder, BuilderComponent } from '@builder.io/react';
builder.init("c4efecdddef14d36a98d2756c1d5f56b");


const history = createBrowserHistory();

const hostname = window && window.location && window.location.hostname;

// only track in production env
if(hostname === "artist.revibe.tech") {
  history.listen(location => {
    ReactGA.set({ page: location.pathname }); // Update the user's current page
    ReactGA.pageview(location.pathname); // Record a pageview for the given page
  });
}

const App = ({ authenticated, checked, uploadInProgress }) => (
  <Router history={history}>
    <div>
    { checked &&
      <>
      <Switch>
      <Route path="/account/register" component={Register}/>
      <Route path="/account/create-profile" component={RegisterArtist}/>
      <Route path="/account/login" component={Login}/>
      <Route path="/contact-us" component={ContactUs}/>
      <Route path="/400" component={Error400}/>
      <Route path="/404" component={Error404}/>
      <Route path="/about-us" component={AboutUs}/>
      <Route path="/why-revibe" component={WhyRevibe}/>
      <PrivateRoute path="/dashboard" component={Authenticated} authenticated={authenticated}/>
      <Route path="/page/*" component={CatchAllPage} />
      <Route path="/" component={Home}/>

     </Switch>
     </>
    }

    </div>

  </Router>
);

const { bool } = PropTypes;

App.propTypes = {
  authenticated: bool.isRequired,
  checked: bool.isRequired
};

function mapStateToProps(state) {
  return {
    checked: state.authentication.checkedLogin,
    authenticated: state.authentication.isLoggedIn,
    uploadInProgress: state.media.uploadInProgress,
  }
};

export default connect(mapStateToProps)(App);
