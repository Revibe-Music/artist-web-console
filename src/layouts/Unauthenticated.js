import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './../views/Login.jsx';
import Register from './../views/Register.jsx';

const Unauthenticated = () => (
  <>
      <Route path="/register" component={Register}/>
      <Route path="/login" component={Login}/>
  </>
);

export default Unauthenticated;
