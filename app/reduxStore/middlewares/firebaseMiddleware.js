import { syncComments } from '../actions/commentActions';
import { syncUsers } from '../actions/usersActions';
import { syncSettings } from '../actions/settingsActions';
import FirebaseAPI from '../../firebase/firebase';

export default function firebaseMiddleware({ getState, dispatch }) {
    return (next) => (action) => {
        switch (action.type) {
            case 'GET_COMMENTS':
                const getCommentsFromFB = (e) => {
                    dispatch(syncComments(e));
                };

                FirebaseAPI.getData(`players/${ action.payload }/comments`, getCommentsFromFB);
                break;
            case 'POST_NEW_COMMENT':
                FirebaseAPI.push(`players/${ action.payload.playerID }/comments`, action.payload.comment);
                break;
            case 'POST_NEW_USER':
                FirebaseAPI.push(`players/${ action.payload.playerID }/users`, action.payload.user);
                break;
            case 'REMOVE_USER':
                FirebaseAPI.remove(`players/${ action.payload.playerID }/users/${ action.payload.id }`);
                break;
            case 'IS_TYPING':
                FirebaseAPI.add(`players/${ action.payload.playerID }/users/${ action.payload.id }/isTyping`, action.payload.value);
                break;
            case 'UPDATE_SETTINGS':
                FirebaseAPI.add(`players/${ action.payload.playerID }/settings/${ action.payload.key }`, action.payload.value);
                break;
            case 'GET_SETTINGS':
                const getSettingsFromFB = (e) => {
                    dispatch(syncSettings(e));
                };

                FirebaseAPI.getData(`players/${ action.payload.playerID }/settings`, getSettingsFromFB);
                break;
            case 'GET_USERS':
                const getUsersFromFB = (e) => {
                    dispatch(syncUsers(e));
                };

                FirebaseAPI.getData(`players/${ action.payload }/users`, getUsersFromFB);
                break;
            default:
                break;
        }
        return next(action);
    };
}
