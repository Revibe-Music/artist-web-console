import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

export default (
  <Switch>
    <Route path="/account/register"/>
    <Route path="/account/login" />
    <Route path="/contact-us" />
    <Route path="/400" />
    <Route path="/404" />
    <Route path="/about-us" />
    <Route path="/why-revibe" />
    {/*<Route path="/login" render={props => <Login {...props} />} />
    <Route path="/register" render={props => <Register {...props} />} />*/}
  </Switch>
)