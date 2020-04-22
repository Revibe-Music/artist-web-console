import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Prompt } from 'react-router'

const PrivateRoute = ({ component, path, authenticated}) => (
  <Route
    path={path}
    render={props => (
      true ?
      (
        React.createElement(component, props)
      )
      :
      (
        <Redirect to={{
          pathname: 'account/login',
          state: { from: props.location }
        }}/>
      )
    )}
  >
  <Prompt
    when={true}
    message='STOP BITCH'
  />
</Route>
);

const { object, bool, string, func } = PropTypes;

PrivateRoute.propTypes = {
  component: func.isRequired,
  path: string.isRequired,
  authenticated: bool.isRequired,
  location: object
};

export default PrivateRoute;
