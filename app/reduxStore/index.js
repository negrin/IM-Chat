import { combineReducers } from 'redux';
import commentReducer from './reducers/commentReducer';
import userReducer from './reducers/userReducer';
import activeUserReducer from './reducers/avtiveUserReducer';

const allReducers = combineReducers({
    commentReducer,
    userReducer,
    activeUserReducer
});

export default allReducers;
