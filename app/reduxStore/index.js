import { combineReducers } from 'redux';
import commentReducer from './reducers/commentReducer';
import userReducer from './reducers/userReducer';
import activeUserIdReducer from './reducers/avtiveUserIdReducer';
import playerReducer from './reducers/playerReducer';
import settingsReducer from './reducers/settingsReducer';

const allReducers = combineReducers({
    commentReducer,
    userReducer,
    activeUserIdReducer,
    playerReducer,
    settingsReducer
});

export default allReducers;
