import { connect } from 'react-redux';
import { syncComments } from '../actions/commentActions';
import { syncUsers } from '../actions/usersActions';
import FirebaseAPI from '../../firebase/firebase';

export default function firebaseMiddleware({ getState, dispatch }) {
    return (next) => (action) => {
        switch (action.type) {
            case 'GET_COMMENTS':
                const getCommentsFromFB = (e) => {
                    dispatch(syncComments(e));
                };

                FirebaseAPI.getData('comments', getCommentsFromFB);
                break;
            case 'POST_NEW_COMMENT':
                FirebaseAPI.push('comments', action.payload);
                break;
            case 'POST_NEW_USER':
                FirebaseAPI.push('users', action.payload);
                break;
            case 'REMOVE_USER':
                FirebaseAPI.remove(`${ 'users/' }${ action.payload }`);
                break;
            case 'IS_TYPING':
                FirebaseAPI.add(`${ 'users/' }${ action.payload.id }${ '/isTyping' }`, action.payload.value);
                break;
            case 'GET_USERS':
                const getUsersFromFB = (e) => {
                    dispatch(syncUsers(e));
                };

                FirebaseAPI.getData('users', getUsersFromFB);
                break;
            default:
                break;
        }
        return next(action);
    };
}
