// This component handles the App template used on every page.
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Authenticated from './Authenticated.js';
import Unauthenticated from './Unauthenticated.js';
import PrivateRoute from './../routes/PrivateRoute.js';
import Login from './../views/Login.jsx';
import Register from './../views/Register.jsx';
import Dashboard from './../views/Dashboard.jsx';
import RegisterArtist from 'views/RegisterArtist.jsx';

const App = ({ authenticated, checked }) => (
  <Router>
    { checked &&
      <Switch>
      <Route path="/account/register" component={Register}/>
      <Route path="/account/create-profile" component={RegisterArtist}/>
      <Route path="/account/login" component={Login}/>
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

const mapState = ({ session }) => ({
  checked: session.checked,
  authenticated: session.authenticated
});

export default connect(mapState)(App);
