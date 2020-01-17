import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './../views/Login.jsx';
import Register from './../views/Register.jsx';
import RegisterArtist from "./../views/RegisterArtist.jsx"
import Home from './../views/Home.jsx'
import ContactUs from "./../views/ContactUs.jsx"
import Error400 from "./../views/Error400.jsx"
import Error404 from "./../views/Error404.jsx"
import AboutUs from "./../views/AboutUs.jsx"
import WhyRevibe from "./../views/WhyRevibe.jsx"


const Unauthenticated = () => (
  <>
      <Route path="/account/register" component={Register}/>
      <Route path="/account/create-profile" component={RegisterArtist}/>
      <Route path="/account/login" component={Login}/>
      <Route path="/contact-us" component={ContactUs}/>
      <Route path="/400" component={Error400}/>
      <Route path="/404" component={Error404}/>
      <Route path="/" component={Home}/>
      <Route path="/about-us" component={AboutUs}/>
      <Route path="/why-revibe" component={WhyRevibe}/>
  </>
);

export default Unauthenticated;
