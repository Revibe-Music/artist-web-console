// This component handles the App template used on every page.
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Authenticated from './layouts/Authenticated.js';
import PrivateRoute from './routes/PrivateRoute.js';
import Login from 'views/Login.jsx';
import Register from 'views/Register.jsx';
import RegisterArtist from 'views/RegisterArtist.jsx';
import ContactUs from 'views/ContactUs.jsx';
import Error400 from 'views/Error400.jsx'
import Error404 from 'views/Error404.jsx'


const App = ({ authenticated, checked }) => (
  <Router>
    { checked &&
      <Switch>
      <Route path="/account/register" component={Register}/>
      <Route path="/account/create-profile" component={RegisterArtist}/>
      <Route path="/account/login" component={Login}/>
      <Route path="/contact-us" component={ContactUs}/>
      <Route path="/400" component={Error400}/>
      <Route path="/404" component={Error404}/>
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
