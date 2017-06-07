import { combineReducers } from 'redux';
import commentReducer from './reducers/commentReducer';
import userReducer from './reducers/userReducer';
import activeUserReducer from './reducers/avtiveUserReducer';
import playerReducer from './reducers/playerReducer';
import settingsReducer from './reducers/settingsReducer';

const allReducers = combineReducers({
    commentReducer,
    userReducer,
    activeUserReducer,
    playerReducer,
    settingsReducer
});

export default allReducers;
