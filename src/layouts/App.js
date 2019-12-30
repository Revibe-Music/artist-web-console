// This component handles the App template used on every page.
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Authenticated from './Authenticated.js';
import PrivateRoute from './../routes/PrivateRoute.js';
import Login from './../views/Login.jsx';
import Register from './../views/Register.jsx';
import RegisterArtist from 'views/RegisterArtist.jsx';
import ContactUs from 'views/ContactUs.jsx';
import ErrorPage404 from 'views/ErrorPage404.jsx'

const App = ({ authenticated, checked }) => (
  <Router>
    { checked &&
      <Switch>
      <Route path="/account/register" component={Register}/>
      <Route path="/account/create-profile" component={RegisterArtist}/>
      <Route path="/account/login" component={Login}/>
      <Route path="/contact-us" component={ContactUs}/>
      <Route path="/error-404" component={ErrorPage404}/>
      <PrivateRoute path="/" component={Authenticated} authenticated={authenticated}/>
     </Switch>
    }
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
    authenticated: state.authentication.isLoggedIn
  }
};

export default connect(mapStateToProps)(App);
