import thunkMiddleware from 'redux-thunk';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { authenticationReducer } from './authentication/reducers.js'
import { mediaReducer } from './media/reducers.js'

// initialize reducers
const rootReducer = combineReducers({
  media: mediaReducer,
  authentication: authenticationReducer
});

const store = createStore(
    rootReducer,
    undefined,
    compose(applyMiddleware(thunkMiddleware))
);

export default store;
