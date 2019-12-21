import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import mainReducers from './reducers/mainReducers';

const middlewares = [thunk];
const store = createStore(combineReducers({mainReducers}), applyMiddleware(...middlewares));

export default store;